<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">My Attendance</h2></div>

      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div>
            <h3>Attendance Summary</h3>
            <div class="muted">Total visits this month: <strong>{{ summary.month }}</strong></div>
          </div>
          <div>
            <button class="btn" @click="checkIn">Check-in</button>
            <button class="btn ghost" @click="checkOut">Check-out</button>
          </div>
        </div>

        <table class="table">
          <thead><tr><th>Date</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="r in records" :key="r.id">
              <td>{{ r.date }}</td>
              <td>{{ r.checkIn }}</td>
              <td>{{ r.checkOut || '-' }}</td>
              <td>{{ r.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getUserRecords, getCurrentUserId, saveRecord } from '../stores/mockData'

const auth = useAuthStore()
const currentUserId = computed(() => getCurrentUserId(auth))
const records = ref([])

const summary = computed(() => ({ month: records.value.length }))

function refreshRecords() {
  records.value = getUserRecords(currentUserId.value, 'attendance')
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function todayDate() {
  return new Date().toISOString().split('T')[0]
}

function checkIn() {
  if (!currentUserId.value) return
  const newRecord = {
    userId: currentUserId.value,
    date: todayDate(),
    checkIn: nowTime(),
    checkOut: null,
    status: 'Present',
  }
  saveRecord('attendance', newRecord)
  refreshRecords()
}

function checkOut() {
  if (!records.value.length) return
  const active = records.value.find(r => !r.checkOut)
  if (!active) return
  active.checkOut = nowTime()
  saveRecord('attendance', active)
  refreshRecords()
}

refreshRecords()
</script>

<style scoped></style>
