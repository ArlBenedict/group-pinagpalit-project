<template>
  <aside class="sidebar" :class="{ 'dashboard-nav-hidden': dashboardMode && isHidden }">
    <div class="sidebar-brand-row">
      <div class="logo">FitHit</div>
    </div>
    <div v-if="!isAdmin" class="sidebar-member">MEMBER SPACE</div>
    <nav :class="{ 'is-open': isOpen }">
      <template v-if="!user">
        <router-link class="nav-link" to="/login">Login</router-link>
      </template>
      <template v-else>
        <router-link class="nav-link" v-if="isAdmin" to="/dashboard">Admin Dashboard</router-link>
        <router-link class="nav-link" v-else to="/user">Dashboard</router-link>

        <!-- User links -->
        <template v-if="!isAdmin">
          <router-link class="nav-link" to="/my-membership">My Membership</router-link>
          <router-link class="nav-link" to="/my-attendance">My Attendance</router-link>
          <router-link class="nav-link" to="/my-payments">My Payments</router-link>
          <router-link class="nav-link" to="/workout-plans">Workout Plans</router-link>
          <router-link class="nav-link" to="/announcements">Announcements</router-link>
          <router-link class="nav-link" to="/profile">My Profile</router-link>
          <router-link class="nav-link" to="/user-settings">Settings</router-link>
          <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
        </template>

        <!-- Admin links -->
        <template v-if="isAdmin">
          <router-link class="nav-link" to="/attendance">Attendance</router-link>
          <router-link class="nav-link" to="/members">Members</router-link>
          <router-link class="nav-link" to="/plans">Plans</router-link>
          <router-link class="nav-link" to="/trainers">Trainers</router-link>
          <router-link class="nav-link" to="/equipment">Equipment</router-link>
          <router-link class="nav-link" to="/payments">Payments</router-link>
          <router-link class="nav-link" to="/reports">Reports</router-link>
          <router-link class="nav-link" to="/settings">Settings</router-link>
          <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
        </template>
      </template>
    </nav>
  </aside>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  dashboardMode: { type: Boolean, default: false },
})

const auth = useAuthStore()
const isOpen = ref(false)
const isHidden = ref(false)
let lastScrollY = 0
let scrollFrame
const user = computed(() => auth.user)
const isAdmin = computed(() => auth.user && auth.user.role === 'ADMIN')

function updateDashboardVisibility() {
  const currentScrollY = window.scrollY
  if (currentScrollY <= 24) {
    isHidden.value = false
  } else if (currentScrollY > lastScrollY + 4) {
    isHidden.value = true
  } else if (currentScrollY < lastScrollY - 4) {
    isHidden.value = false
  }
  lastScrollY = currentScrollY
  scrollFrame = undefined
}

function handleDashboardScroll() {
  if (scrollFrame === undefined) scrollFrame = requestAnimationFrame(updateDashboardVisibility)
}

function updateDashboardScrollMode(enabled) {
  window.removeEventListener('scroll', handleDashboardScroll)
  isHidden.value = false
  lastScrollY = window.scrollY
  if (enabled) window.addEventListener('scroll', handleDashboardScroll, { passive: true })
}

onMounted(() => updateDashboardScrollMode(props.dashboardMode))
watch(() => props.dashboardMode, updateDashboardScrollMode)
watch(
  () => window.location.pathname,
  () => {
    isOpen.value = false
    isHidden.value = false
  },
)
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleDashboardScroll)
  cancelAnimationFrame(scrollFrame)
})
function logout() {
  auth.logout()
  window.location.href = '/login'
}
</script>

<style scoped>
.logo {
  letter-spacing: 0.6px;
}
.nav-link {
  display: block;
}
</style>
