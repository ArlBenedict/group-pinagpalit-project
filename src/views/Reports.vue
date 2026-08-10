<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Reports</h2></div>
      <div class="card">
        <h3>Membership Summary</h3>
        <p class="muted">Simple mock reports to preview UI</p>
        <div style="display:flex;gap:12px;margin-top:12px">
          <div class="card" style="flex:1">
            <h3>Total Active</h3>
            <div class="value">{{ totalActive }}</div>
          </div>
          <div class="card" style="flex:1">
            <h3>Revenue (month)</h3>
            <div class="value">{{ revenue }}</div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { computed } from 'vue'
import { formatPHP } from '../utils/currency'
import { getAllRecords } from '../stores/mockData'

const memberships = computed(() => getAllRecords('memberships'))
const payments = computed(() => getAllRecords('payments'))
const users = computed(() => getAllRecords('users'))
const members = computed(() => getAllRecords('members'))

const totalActive = computed(() => {
  return memberships.value.filter(membership => {
    if (membership.status !== 'Active') return false
    const member = members.value.find(m => m.id === membership.userId)
    return member ? member.role !== 'ADMIN' : false
  }).length
})

const revenue = computed(() => {
  const monthKey = new Date().toISOString().slice(0, 7)
  const total = payments.value
    .filter(payment => payment.status === 'Paid' && payment.date?.startsWith(monthKey))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)
  return formatPHP(total)
})
</script>

<style scoped></style>
