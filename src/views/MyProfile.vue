<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">My Profile</h2></div>

      <div class="card">
        <div class="form-row">
          <div class="form-control" style="flex:1"><label>Name</label><input v-model="profile.name" /></div>
          <div class="form-control" style="flex:1"><label>Phone</label><input v-model="profile.phone" /></div>
        </div>
        <div class="form-control"><label>Email</label><input v-model="profile.email" /></div>
        <div style="display:flex;justify-content:flex-end"><button class="btn" @click="save">Save</button></div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { reactive, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getAllRecords, getCurrentUserId, saveRecord } from '../stores/mockData'

const auth = useAuthStore()
const profile = reactive({ id: '', name: '', email: '', phone: '' })
const currentUserId = getCurrentUserId(auth)

function loadProfile() {
  if (!currentUserId) return
  const user = getAllRecords('users').find(u => u.id === currentUserId)
  if (user) {
    profile.id = user.id
    profile.name = user.name || ''
    profile.email = user.email || ''
    profile.phone = user.phone || ''
  }
}

loadProfile()

watch(() => currentUserId, loadProfile)

function save() {
  if (!profile.id) return
  saveRecord('users', {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    role: auth.user.role,
  })
  alert('Profile saved')
}
</script>

<style scoped></style>
