<template>
  <AppLayout>
    <main class="user-page detail-page">
      <UserPageHeader
        eyebrow="MEMBER SPACE / 07"
        title="Settings"
        description="Shape your FitHit space around the way you train."
      />
      <div class="card settings-panel">
        <div class="section-label">PREFERENCES</div>
        <h2>Account preferences</h2>
        <div class="form-control">
          <label>Notifications</label>
          <select v-model="prefs.notifications">
            <option>All</option>
            <option>Only important</option>
            <option>None</option>
          </select>
        </div>
        <div class="form-control">
          <label>Appearance</label>
          <select v-model="prefs.appearance" @change="updateTheme">
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <div class="detail-action-row">
          <button class="btn" @click="save">Save preferences</button>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import UserPageHeader from '../components/UserPageHeader.vue'
import { reactive } from 'vue'
import { applyTheme, getStoredTheme } from '../utils/theme'

const prefs = reactive({
  notifications: 'All',
  appearance: getStoredTheme() === 'dark' ? 'Dark' : 'Light',
})
function updateTheme() {
  applyTheme(prefs.appearance.toLowerCase())
}
function save() {
  alert('Settings saved (mock)')
}
</script>

<style scoped></style>
