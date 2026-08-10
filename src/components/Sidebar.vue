<template>
  <aside class="sidebar">
    <div class="logo">FitHit</div>
    <nav>
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
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const user = computed(() => auth.user)
const isAdmin = computed(() => auth.user && auth.user.role === 'ADMIN')
function logout(){ auth.logout(); window.location.href = '/login' }
</script>

<style scoped>
.logo{letter-spacing:0.6px}
.nav-link{display:block}
</style>
