<template>
  <AppLayout>
    <main class="user-page detail-page">
      <UserPageHeader
        eyebrow="MEMBER SPACE / 02"
        title="Your attendance"
        description="A clear record of the sessions that keep you moving forward."
        ><div class="action-pair">
          <button class="btn" @click="checkIn">Check-in</button
          ><button class="btn ghost" @click="checkOut">Check-out</button>
        </div></UserPageHeader
      >
      <section class="attendance-summary">
        <div>
          <div class="section-label">THIS MONTH</div>
          <strong>{{ summary.month }}</strong
          ><span>VISITS</span>
        </div>
        <div class="attendance-note">Every check-in counts. Keep building your rhythm.</div>
      </section>
      <section class="card detail-panel">
        <div class="section-label">HISTORY</div>
        <h3>Session history</h3>
        <div v-if="records.length" class="attendance-list">
          <div v-for="record in records" :key="record.id" class="attendance-row">
            <span class="attendance-date">{{ record.date }}</span
            ><strong>{{ record.checkIn }}</strong
            ><span>{{ record.checkOut || 'Still training' }}</span
            ><span class="status-pill">{{ record.status }}</span>
          </div>
        </div>
        <div v-else class="premium-empty">
          <h3>Your first session is waiting.</h3>
          <p class="section-copy">Use Check-in when you arrive at the gym.</p>
        </div>
      </section>
    </main>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import UserPageHeader from '../components/UserPageHeader.vue'
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
  const active = records.value.find((r) => !r.checkOut)
  if (!active) return
  active.checkOut = nowTime()
  saveRecord('attendance', active)
  refreshRecords()
}

refreshRecords()
</script>

<style scoped></style>
