<template>
  <AppLayout>
    <main class="user-page detail-page">
      <UserPageHeader
        eyebrow="MEMBER SPACE / 05"
        title="Inside FitHit"
        description="Updates, moments, and useful things from your gym community."
      />
      <section class="announcement-feed">
        <article
          v-for="(announcement, index) in announcements"
          :key="announcement.id"
          class="announcement-card"
        >
          <div class="announcement-index">0{{ index + 1 }}</div>
          <div>
            <div class="membership-kicker">{{ announcement.date }}</div>
            <h2>{{ announcement.title }}</h2>
            <p>{{ announcement.body }}</p>
          </div>
        </article>
      </section>
    </main>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import UserPageHeader from '../components/UserPageHeader.vue'
import { ref } from 'vue'

const announcements = ref([
  {
    id: 1,
    title: 'Holiday Hours',
    date: '2026-08-01',
    body: 'We will be closed on public holidays.',
  },
  {
    id: 2,
    title: 'New Trainer',
    date: '2026-07-20',
    body: 'Welcome Priya — new yoga classes added.',
  },
])
</script>

<style scoped></style>
