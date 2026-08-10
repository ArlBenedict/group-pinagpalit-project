<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Workout Plans</h2></div>

      <div v-if="!currentUser">
        <div class="card">
          <p class="muted">Please log in to view your workout plan.</p>
        </div>
      </div>

      <div v-else-if="!assignedPlan">
        <div class="card">
          <h3>No workout plan assigned yet</h3>
          <p class="muted">Please contact your trainer or administrator to get started.</p>
        </div>
      </div>

      <div v-else>
        <div class="card">
          <h3>{{ assignedPlan.title }}</h3>
          <div class="muted">Difficulty: {{ assignedPlan.difficulty }}</div>
          <div style="margin-top:8px">Trainer: {{ assignedPlan.trainer }}</div>
          <div style="margin-top:8px">Exercises: {{ assignedPlan.exercises.length }}</div>
        </div>

        <div class="card">
          <h3>Plan Details</h3>
          <div v-for="ex in assignedPlan.exercises" :key="ex.name" style="margin-bottom:8px">
            <strong>{{ ex.name }}</strong> — {{ ex.sets }} x {{ ex.reps }}
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getCurrentUserId, getUserRecords, getAllRecords } from '../stores/mockData'

const workoutPlans = [
  { id: 1, title: 'Full Body Starter', difficulty: 'Beginner', trainer: 'Jordan', exercises: [{ name: 'Squat', sets: 3, reps: 10 }, { name: 'Push-up', sets: 3, reps: 12 }] },
]

const auth = useAuthStore()
const currentUserId = computed(() => getCurrentUserId(auth))
const currentUser = computed(() => auth.user)

const members = computed(() => getAllRecords('members'))

const assignedMember = computed(() => {
  if (!currentUser.value) return null
  const byId = members.value.find(member => member.userId === currentUserId.value)
  if (byId) return byId
  return members.value.find(member => member.email === currentUser.value.email)
})

const assignedPlan = computed(() => {
  if (!assignedMember.value || !assignedMember.value.workoutPlanId) return null
  return workoutPlans.find(plan => plan.id === assignedMember.value.workoutPlanId) || null
})
</script>

<style scoped></style>
