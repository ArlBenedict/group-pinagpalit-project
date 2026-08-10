<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <div class="value">{{ value }}</div>
    <div class="muted" v-if="sub">{{ sub }}</div>
  </div>
</template>

<script setup>
defineProps({ title: String, value: [String, Number], sub: String })
</script>

<style scoped></style>
