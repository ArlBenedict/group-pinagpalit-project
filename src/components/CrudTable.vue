<template>
  <div>
    <div style="display:flex;justify-content:space-between;margin-bottom:12px;align-items:center">
      <div style="display:flex;gap:8px">
        <input class="search" v-model="q" placeholder="Search..." />
        <select v-model="filter" class="search">
          <option value="">All</option>
        </select>
      </div>
      <div>
        <button class="btn" @click="$emit('add')">Add New</button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th v-for="c in columns" :key="c.key">{{ c.label }}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in filtered" :key="row.id">
          <td v-for="c in columns" :key="c.key">{{ row[c.key] }}</td>
          <td>
            <div class="controls">
              <button class="btn ghost" @click="$emit('edit', row)">Edit</button>
              <button class="btn ghost" @click="$emit('delete', row)">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ columns: Array, rows: Array })
const q = ref('')
const filter = ref('')
const filtered = computed(() => {
  if (!q.value) return props.rows
  const t = q.value.toLowerCase()
  return props.rows.filter(r => Object.values(r).join(' ').toLowerCase().includes(t))
})
</script>

<style scoped></style>
