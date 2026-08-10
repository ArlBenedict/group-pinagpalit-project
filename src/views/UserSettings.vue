<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Settings</h2></div>
      <div class="card">
        <h3>Account Preferences</h3>
        <div class="form-control"><label>Notifications</label>
          <select v-model="prefs.notifications"><option>All</option><option>Only important</option><option>None</option></select>
        </div>
        <div class="form-control"><label>Appearance</label>
          <select v-model="prefs.appearance"><option>System</option><option>Dark</option><option>Light</option></select>
        </div>
        <div style="display:flex;justify-content:flex-end"><button class="btn" @click="save">Save</button></div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { reactive } from 'vue'

const prefs = reactive({ notifications:'All', appearance:'Dark' })
function save(){ alert('Settings saved (mock)') }
</script>

<style scoped></style>
