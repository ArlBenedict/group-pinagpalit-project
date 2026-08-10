<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Settings</h2></div>
      <div class="card">
        <h3>General</h3>
        <div class="form-control"><label>Gym name</label><input v-model="name" /></div>
        <div class="form-control"><label>Timezone</label><select v-model="tz"><option>UTC</option><option>Local</option></select></div>
        <div style="display:flex;justify-content:flex-end"><button class="btn" @click="save">Save</button></div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { ref } from 'vue'
const name = ref('FitHit Gym')
const tz = ref('UTC')
function save(){ alert('Settings saved (mock)') }
</script>

<style scoped></style>
