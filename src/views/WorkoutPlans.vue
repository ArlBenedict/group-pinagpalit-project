<template>
  <AppLayout>
    <main class="user-page detail-page">
      <UserPageHeader
        eyebrow="MEMBER SPACE / 04"
        title="Your program"
        description="Training is clearer when you know what you are working toward."
      />

      <div v-if="!currentUser">
        <div class="premium-empty">
          <h3>Please log in to view your workout plan.</h3>
        </div>
      </div>

      <div v-else-if="!assignedPlan">
        <div class="premium-empty">
          <h3>No workout plan assigned yet.</h3>
          <p class="section-copy">Please contact your trainer or administrator to get started.</p>
        </div>
      </div>

      <div v-else>
        <div class="program-hero">
          <div class="workout-number">01</div>
          <div>
            <div class="membership-kicker">{{ assignedPlan.difficulty }}</div>
            <h2>{{ assignedPlan.title }}</h2>
            <p>
              Trainer: {{ assignedPlan.trainer }} <span>/</span>
              {{ assignedPlan.exercises.length }} exercises
            </p>
          </div>
        </div>

        <div class="exercise-grid">
          <div v-for="(ex, index) in assignedPlan.exercises" :key="ex.name" class="exercise-card">
            <span>0{{ index + 1 }}</span
            ><strong>{{ ex.name }}</strong
            ><small>{{ ex.sets || 3 }} sets / {{ ex.reps || 10 }} reps</small>
          </div>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import UserPageHeader from '../components/UserPageHeader.vue'
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getCurrentUserId, getUserRecords, getAllRecords } from '../stores/mockData'

const workoutPlans = [
  {
    id: 1,
    title: 'Full Body Starter',
    difficulty: 'Beginner',
    trainer: 'Jordan',
    exercises: [
      { name: 'Squat', sets: 3, reps: 10 },
      { name: 'Push-up', sets: 3, reps: 12 },
    ],
  },
]

const auth = useAuthStore()
const currentUserId = computed(() => getCurrentUserId(auth))
const currentUser = computed(() => auth.user)

const members = computed(() => getAllRecords('members'))

const assignedMember = computed(() => {
  if (!currentUser.value) return null
  const byId = members.value.find((member) => member.userId === currentUserId.value)
  if (byId) return byId
  return members.value.find((member) => member.email === currentUser.value.email)
})

const assignedPlan = computed(() => {
  if (!assignedMember.value || !assignedMember.value.workoutPlanId) return null
  return workoutPlans.find((plan) => plan.id === assignedMember.value.workoutPlanId) || null
})
</script>

<style scoped></style>
