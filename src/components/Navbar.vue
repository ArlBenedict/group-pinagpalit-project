<template>
  <div class="topbar">
    <div>
      <slot name="left"></slot>
    </div>
    <div style="display:flex;gap:12px;align-items:center">
      <div class="muted">{{ displayName }}</div>
      <button class="btn ghost" @click="handleLogout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const displayName = computed(() => auth.user ? `${auth.user.name}` : 'Guest')
function handleLogout(){ auth.logout(); router.push('/login') }
</script>

<style scoped></style>
