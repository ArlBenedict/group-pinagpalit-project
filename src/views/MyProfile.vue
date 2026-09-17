<template>
  <AppLayout>
    <main class="user-page detail-page">
      <UserPageHeader
        eyebrow="MEMBER SPACE / 06"
        title="Your profile"
        description="Keep your member details current so FitHit can stay connected with you."
      />
      <section class="profile-layout">
        <div class="profile-intro">
          <div class="profile-avatar">{{ profile.name.slice(0, 1).toUpperCase() || 'F' }}</div>
          <div class="eyebrow">FIT HIT MEMBER</div>
          <h2>{{ profile.name || 'Your name' }}</h2>
          <p>{{ profile.email || 'Add your email address' }}</p>
        </div>
        <div class="card profile-form">
          <div class="form-row">
            <div class="form-control" style="flex: 1">
              <label>Name</label><input v-model="profile.name" />
            </div>
            <div class="form-control" style="flex: 1">
              <label>Phone</label><input v-model="profile.phone" />
            </div>
          </div>
          <div class="form-control"><label>Email</label><input v-model="profile.email" /></div>
          <div class="detail-action-row">
            <button class="btn" @click="save">Save changes</button>
          </div>
        </div>
      </section>
    </main>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import UserPageHeader from '../components/UserPageHeader.vue'
import { reactive, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { getAllRecords, getCurrentUserId, saveRecord } from '../stores/mockData'

const auth = useAuthStore()
const profile = reactive({ id: '', name: '', email: '', phone: '' })
const currentUserId = getCurrentUserId(auth)

function loadProfile() {
  if (!currentUserId) return
  const user = getAllRecords('users').find((u) => u.id === currentUserId)
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
