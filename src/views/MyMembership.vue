<template>
  <AppLayout>
    <main class="user-page detail-page">
      <UserPageHeader
        eyebrow="MEMBER SPACE / 01"
        title="Your membership"
        description="Everything you need to know about your access, plan, and next renewal."
      />
      <section class="membership-detail-hero">
        <div>
          <div class="membership-kicker">CURRENT PLAN</div>
          <h2>{{ membership.plan }}</h2>
          <span class="status-pill">{{ membership.status }}</span>
        </div>
        <div class="detail-metric">
          <strong>{{ membership.daysRemaining }}</strong
          ><span>days remaining</span>
        </div>
        <div class="detail-dates">
          <span
            >START <b>{{ membership.start }}</b></span
          ><span
            >EXPIRES <b>{{ membership.end }}</b></span
          >
        </div>
      </section>
      <section class="detail-columns page-section">
        <div class="card detail-panel">
          <div class="section-label">PLAN BENEFITS</div>
          <h3>Built for your rhythm.</h3>
          <ul class="benefit-list">
            <li v-for="benefit in membership.benefits" :key="benefit">
              <span>✓</span>{{ benefit }}
            </li>
          </ul>
        </div>
        <div class="card detail-panel">
          <div class="section-label">NEW PLAN</div>
          <h3>Keep your momentum going.</h3>
          <p class="section-copy">
            Choose a plan and payment method. New payments remain pending until admin approval.
          </p>
          <div class="form-control">
            <label>Select Plan</label>
            <select v-model="form.plan">
              <option value="">Choose a plan</option>
              <option v-for="plan in plans" :key="plan.title" :value="plan.title">
                {{ planLabel(plan) }}
              </option>
            </select>
          </div>
          <div class="form-control" style="margin-top: 8px">
            <label>Payment Method</label>
            <select v-model="form.method">
              <option value="">Choose method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="GCash">GCash</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
          <div class="detail-action-row">
            <button class="btn" @click="submitPayment" :disabled="!form.plan || !form.method">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import UserPageHeader from '../components/UserPageHeader.vue'
import { computed, ref } from 'vue'
import { formatPHP } from '../utils/currency'
import { useAuthStore } from '../stores/auth'
import {
  getUserRecords,
  getCurrentUserId,
  saveRecord,
  getAvailablePlans,
  createOrUpdatePendingMembership,
  dataVersion,
} from '../stores/mockData'

const auth = useAuthStore()
const currentUserId = computed(() => getCurrentUserId(auth))
const membershipRecord = computed(() => {
  dataVersion.value
  return getUserRecords(currentUserId.value, 'memberships')[0] || null
})
const plans = ref(getAvailablePlans())
const form = ref({ plan: '', method: '', date: new Date().toISOString().split('T')[0] })

const membership = computed(() => {
  if (!membershipRecord.value) {
    return {
      plan: 'No active membership',
      price: '',
      start: '-',
      end: '-',
      daysRemaining: 0,
      status: 'Inactive',
      benefits: ['No membership benefits available.'],
    }
  }
  const price = membershipRecord.value.price ? formatPHP(membershipRecord.value.price) : ''
  const end = membershipRecord.value.end || '-'
  const start = membershipRecord.value.start || '-'
  const status = membershipRecord.value.status || 'Pending'
  const benefits = membershipRecord.value.benefits || ['Standard access benefits']
  const daysRemaining = membershipRecord.value.daysRemaining || 0
  return { plan: membershipRecord.value.plan, price, start, end, status, benefits, daysRemaining }
})

function planLabel(plan) {
  return `${plan.title} - ${formatPHP(plan.price)}`
}

function submitPayment() {
  console.log('Subscribe button clicked', form.value)
  if (!currentUserId.value || !form.value.plan || !form.value.method) {
    console.error('Membership payment validation failed', {
      currentUserId: currentUserId.value,
      form: form.value,
    })
    return
  }
  saveRecord('payments', {
    userId: currentUserId.value,
    amount: plans.value.find((p) => p.title === form.value.plan)?.price || 0,
    date: form.value.date,
    status: 'Pending',
    method: form.value.method,
    plan: form.value.plan,
  })
  createOrUpdatePendingMembership(currentUserId.value, form.value.plan)
  form.value = { plan: '', method: '', date: new Date().toISOString().split('T')[0] }
}
</script>

<style scoped></style>
