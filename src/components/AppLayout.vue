<template>
  <div class="app-shell">
    <Sidebar />
    <div class="main">
      <Navbar>
        <template #left>
          <router-link to="/dashboard" style="color:#fff;font-weight:600">FitHit</router-link>
        </template>
      </Navbar>
      <slot />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'
</script>

<style scoped></style>
