<template>
  <AppLayout>
    <main class="user-page detail-page">
      <UserPageHeader
        eyebrow="MEMBER SPACE / 03"
        title="Your payments"
        description="A transparent view of your membership payments and their current status."
      />
      <section v-if="payments.length" class="payment-list">
        <article v-for="payment in payments" :key="payment.id" class="payment-row">
          <div class="payment-icon">₱</div>
          <div class="payment-main">
            <strong>{{ formatAmount(payment) }}</strong
            ><span>{{ payment.plan || 'Membership payment' }}</span>
          </div>
          <div class="payment-meta">
            <span>{{ payment.date }}</span
            ><span>{{ payment.method }}</span>
          </div>
          <span class="status-pill" :class="{ 'is-paid': payment.status === 'Paid' }">{{
            payment.status
          }}</span>
        </article>
      </section>
      <section v-else class="premium-empty">
        <h3>No payments yet.</h3>
        <p class="section-copy">Your membership payments will appear here once recorded.</p>
        <router-link to="/my-membership" class="text-link"
          >View membership options <span>-></span></router-link
        >
      </section>
    </main>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import UserPageHeader from '../components/UserPageHeader.vue'
import { computed } from 'vue'
import { formatPHP } from '../utils/currency'
import { useAuthStore } from '../stores/auth'
import { getUserRecords, getCurrentUserId, saveRecord } from '../stores/mockData'

const auth = useAuthStore()
const currentUserId = computed(() => getCurrentUserId(auth))
const payments = computed(() => getUserRecords(currentUserId.value, 'payments'))

function formatAmount(payment) {
  return payment.amount ? formatPHP(payment.amount) : formatPHP(0)
}
</script>

<style scoped></style>
