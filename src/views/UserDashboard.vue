<template>
  <AppLayout>
    <div>
        <div class="topbar">
          <div>
            <h2 style="margin:0">Welcome back, {{ displayName }}! 👋</h2>
            <div class="muted">Here's your fitness overview for today.</div>
          </div>
        </div>

        <div class="card-row">
          <div class="card">
            <h3>Membership Status</h3>
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div>
                <div class="value">{{ membership.plan }}</div>
                <div class="muted">Expires: {{ membership.end }}</div>
              </div>
              <div style="text-align:right">
                <div class="muted">Status</div>
                <div style="margin-top:6px"><span class="badge">{{ membership.status }}</span></div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3>Attendance</h3>
            <div class="muted">This month</div>
            <div class="value" style="margin-top:8px">{{ attendance.month }}</div>
            <div class="muted" style="margin-top:8px">
              <template v-if="recentCheckins.length">Recent: {{ recentCheckins[0].date }} {{ recentCheckins[0].checkin }}</template>
              <template v-else>No attendance records yet</template>
            </div>
            <div style="margin-top:12px">
              <div class="progress">
                <div class="progress-bar" :style="{ width: attendancePercent + '%' }"></div>
              </div>
              <div class="muted" style="margin-top:6px">
                <template v-if="attendance.goal">{{ attendancePercent }}% of monthly goal</template>
                <template v-else>No goal set yet</template>
              </div>
            </div>
          </div>

          <div class="card">
            <h3>Recent Payment</h3>
            <div class="muted">{{ lastPayment.date }}</div>
            <div class="value" style="margin-top:8px">{{ lastPayment.amount }}</div>
            <div class="muted" style="margin-top:8px">{{ lastPayment.status }}</div>
          </div>
        </div>

        <div class="card-row" style="margin-top:18px">
          <div class="card" style="flex:1">
            <h3>Quick Actions</h3>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
              <router-link to="/my-membership" class="btn ghost">View Membership</router-link>
              <router-link to="/my-attendance" class="btn ghost">View Attendance</router-link>
              <router-link to="/my-payments" class="btn ghost">Payment History</router-link>
              <router-link to="/workout-plans" class="btn ghost">Workout Plans</router-link>
            </div>
          </div>

          <div class="card" style="width:360px">
            <h3>Recent Check-ins</h3>
            <table class="table" style="margin-top:8px">
              <thead><tr><th>Date</th><th>Check-in</th></tr></thead>
              <tbody>
                <tr v-for="r in recentCheckins" :key="r.id"><td>{{ r.date }}</td><td>{{ r.checkin }}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { formatPHP } from '../utils/currency'
import { getAllRecords, getUserRecords, getCurrentUserId, dataVersion } from '../stores/mockData'

const auth = useAuthStore()
const displayName = computed(() => (auth.user && auth.user.name) ? auth.user.name : 'Member')
const currentUserId = computed(() => getCurrentUserId(auth))

const membershipRecord = computed(() => {
  dataVersion.value
  const records = getUserRecords(currentUserId.value, 'memberships')
  return records[0] || null
})

const paymentRecords = computed(() => getUserRecords(currentUserId.value, 'payments'))
const attendanceRecords = computed(() => getUserRecords(currentUserId.value, 'attendance'))
const workoutAssignments = computed(() => getUserRecords(currentUserId.value, 'workoutAssignments'))

const membership = computed(() => {
  if (!membershipRecord.value) {
    return { plan: 'No active membership', price: '', start: '', end: '', status: 'Inactive' }
  }
  return {
    plan: membershipRecord.value.plan || 'No active membership',
    price: membershipRecord.value.price ? formatPHP(membershipRecord.value.price) : '',
    start: membershipRecord.value.start || '-',
    end: membershipRecord.value.end || '-',
    status: membershipRecord.value.status || 'Inactive',
  }
})

const attendance = computed(() => {
  const count = attendanceRecords.value.length
  return { month: count, goal: 20 }
})

const attendancePercent = computed(() => {
  if (!attendance.value?.goal) return 0
  return Math.round((attendance.value.month / attendance.value.goal) * 100)
})

const recentCheckins = computed(() => {
  return attendanceRecords.value
    .slice(0, 5)
    .map(record => ({ id: record.id, date: record.date, checkin: record.checkIn }))
})

const lastPayment = computed(() => {
  const sorted = [...paymentRecords.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latest = sorted[0]
  if (!latest) return { date: '-', amount: '-', status: 'None' }
  return {
    date: latest.date || '-',
    amount: latest.amount ? formatPHP(latest.amount) : formatPHP(0),
    status: latest.status || 'Pending',
  }
})
</script>

<style scoped>
.badge{display:inline-block;padding:6px 10px;border-radius:999px;background:rgba(249,115,22,0.12);color:var(--accent);font-weight:600}
.progress{height:8px;background:rgba(255,255,255,0.04);border-radius:8px;overflow:hidden}
.progress-bar{height:100%;background:linear-gradient(90deg,var(--accent),#ffbb88);border-radius:8px}
.card h3{margin:0 0 8px 0}
.card .value{font-size:20px}
.btn.ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--muted);padding:8px 10px;border-radius:8px}
.card-row{gap:16px}
@media(max-width:900px){
  .card-row{grid-template-columns:1fr}
}
</style>
