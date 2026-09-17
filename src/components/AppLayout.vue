<template>
  <div class="app-shell" :class="{ 'user-shell': !isAdmin }">
    <Sidebar :dashboard-mode="isUserDashboard" />
    <div class="main">
      <Navbar>
        <template #left>
          <router-link :to="isAdmin ? '/dashboard' : '/user'" class="main-brand"
            >FitHit</router-link
          >
        </template>
      </Navbar>
      <slot />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRoute } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()
const isAdmin = computed(() => auth.user?.role === 'ADMIN')
const isUserDashboard = computed(() => route.path === '/user')
</script>

<style scoped></style>
