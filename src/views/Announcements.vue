<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Announcements</h2></div>

      <div class="card">
        <ul>
          <li v-for="a in announcements" :key="a.id" style="margin-bottom:12px">
            <strong>{{ a.title }}</strong> <span class="muted">— {{ a.date }}</span>
            <div class="muted">{{ a.body }}</div>
          </li>
        </ul>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { ref } from 'vue'

const announcements = ref([
  { id:1, title:'Holiday Hours', date:'2026-08-01', body:'We will be closed on public holidays.' },
  { id:2, title:'New Trainer', date:'2026-07-20', body:'Welcome Priya — new yoga classes added.' },
])
</script>

<style scoped></style>
