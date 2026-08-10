<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">My Membership</h2></div>

      <div class="card-row">
        <div class="card">
          <h3>Current Plan</h3>
          <div class="value">{{ membership.plan }}</div>
          <div class="muted">Status: <strong>{{ membership.status }}</strong></div>
        </div>
        <div class="card">
          <h3>Dates</h3>
          <div class="muted">Start: {{ membership.start }}</div>
          <div class="muted">Expires: {{ membership.end }}</div>
          <div style="margin-top:8px" class="muted">Days remaining: <strong>{{ membership.daysRemaining }}</strong></div>
        </div>
        <div class="card">
          <h3>Price</h3>
          <div class="value">{{ membership.price }}</div>
        </div>
      </div>

      <div class="card">
        <h3>Benefits</h3>
        <ul>
          <li v-for="b in membership.benefits" :key="b">{{ b }}</li>
        </ul>
      </div>

      <div class="card" style="margin-top:16px">
        <h3>Purchase a New Plan</h3>
        <div class="form-control">
          <label>Select Plan</label>
          <select v-model="form.plan">
            <option value="">Choose a plan</option>
            <option v-for="plan in plans" :key="plan.title" :value="plan.title">
              {{ planLabel(plan) }}
            </option>
          </select>
        </div>
        <div class="form-control" style="margin-top:8px">
          <label>Payment Method</label>
          <select v-model="form.method">
            <option value="">Choose method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="GCash">GCash</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" @click="submitPayment" :disabled="!form.plan || !form.method">Subscribe</button>
          <div class="muted">Payments are saved as Pending until admin approval.</div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { computed, ref } from 'vue'
import { formatPHP } from '../utils/currency'
import { useAuthStore } from '../stores/auth'
import { getUserRecords, getCurrentUserId, saveRecord, getAvailablePlans, createOrUpdatePendingMembership, dataVersion } from '../stores/mockData'

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
    console.error('Membership payment validation failed', { currentUserId: currentUserId.value, form: form.value })
    return
  }
  saveRecord('payments', {
    userId: currentUserId.value,
    amount: plans.value.find(p => p.title === form.value.plan)?.price || 0,
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
