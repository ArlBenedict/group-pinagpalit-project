<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">My Payments</h2></div>

      <div class="card">
        <h3>Payment History</h3>
        <table class="table">
          <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th><th></th></tr></thead>
          <tbody>
            <tr v-for="p in payments" :key="p.id">
              <td>{{ p.date }}</td>
              <td>{{ p.amount }}</td>
              <td>{{ p.method }}</td>
              <td>{{ p.status }}</td>
              <td><button class="btn ghost">Details</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
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
