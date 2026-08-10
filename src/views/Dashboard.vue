<template>
	<AppLayout>
		<div>
			<div class="topbar">
				<div>
					<h2 style="margin:0">Dashboard</h2>
					<div class="muted">Overview of gym activity</div>
				</div>
			</div>

			<div class="card-row">
        <StatCard title="Members" :value="totalMembers" sub="Registered users" />
        <StatCard title="Active Memberships" :value="activeMemberships" sub="Current active plans" />
        <StatCard title="Check-ins" :value="checkInsToday" sub="Today" />
			</div>

			<div class="card">
				<h3>Recent Activity</h3>
				<table class="table" style="margin-top:12px">
					<thead>
						<tr><th>Time</th><th>Activity</th><th>User</th></tr>
					</thead>
					<tbody>
						<tr v-for="(r,i) in recent" :key="i">
							<td>{{ r.time }}</td>
							<td>{{ r.text }}</td>
							<td>{{ r.user }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import StatCard from '../components/StatCard.vue'
import { computed } from 'vue'
import { formatPHP } from '../utils/currency'
import { getAllRecords } from '../stores/mockData'

const members = computed(() => getAllRecords('members'))
const users = computed(() => getAllRecords('users'))
const memberships = computed(() => getAllRecords('memberships'))
const payments = computed(() => getAllRecords('payments'))
const attendance = computed(() => getAllRecords('attendance'))

const totalMembers = computed(() => members.value.filter(member => member.role !== 'ADMIN').length)
const activeMemberships = computed(() => {
  return memberships.value.filter(membership => {
    if (membership.status !== 'Active') return false
    return members.value.some(member => member.id === membership.userId && member.role !== 'ADMIN')
  }).length
})
const checkInsToday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return attendance.value.filter(record => record.date === today).length
})
const revenue = computed(() => formatPHP(payments.value.reduce((sum, item) => sum + Number(item.amount || 0), 0)))

const recent = computed(() => {
  const recentPayments = [...payments.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  return recentPayments.map(payment => {
    const user = users.value.find(u => u.id === payment.userId)
    return {
      time: payment.date,
      text: 'Payment received',
      user: user ? user.name : 'Unknown',
    }
  })
})
</script>

<style scoped></style>
