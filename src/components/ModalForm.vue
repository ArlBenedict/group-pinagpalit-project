<template>
  <div class="modal-backdrop">
    <div class="modal">
      <h3>{{ title }}</h3>
      <slot />
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
        <button class="btn ghost" @click="$emit('cancel')">Cancel</button>
        <button class="btn" @click="$emit('save')">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: { type: String, default: 'Form' } })
</script>

<style scoped></style>
