<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Attendance</h2></div>
      <div class="card">
        <CrudTable :columns="columns" :rows="records" @add="openAdd" @edit="openEdit" @delete="del" />
      </div>

      <ModalForm v-if="showModal" title="Attendance" @cancel="closeModal" @save="save">
        <div class="form-control">
          <label>Member</label>
          <select v-model="form.userId">
            <option value="">Select member</option>
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-control" style="flex:1"><label>Date</label><input type="date" v-model="form.date" /></div>
          <div class="form-control" style="flex:1"><label>Check-in</label><input v-model="form.checkIn" /></div>
        </div>
        <div class="form-row">
          <div class="form-control" style="flex:1"><label>Check-out</label><input v-model="form.checkOut" /></div>
          <div class="form-control" style="flex:1"><label>Status</label><input v-model="form.status" /></div>
        </div>
      </ModalForm>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import CrudTable from '../components/CrudTable.vue'
import ModalForm from '../components/ModalForm.vue'
import { ref, computed } from 'vue'
import { getAllRecords, saveRecord, deleteRecord } from '../stores/mockData'

const columns = [{ key: 'member', label: 'Member' }, { key: 'date', label: 'Date' }, { key: 'checkIn', label: 'Check-in' }, { key: 'checkOut', label: 'Check-out' }, { key: 'status', label: 'Status' }]
const recordsRaw = ref(getAllRecords('attendance'))
const users = ref(getAllRecords('users'))
const showModal = ref(false)
const form = ref({ id:null, userId:'', date:'', checkIn:'', checkOut:'', status:'Present' })

function findUserName(userId) {
  const user = users.value.find(u => u.id === userId)
  return user ? user.name : 'Unknown'
}

const records = computed(() => recordsRaw.value.map(r => ({ ...r, member: findUserName(r.userId) })))

function openAdd(){ form.value = { id:null, userId:'', date:'', checkIn:'', checkOut:'', status:'Present' }; showModal.value = true }
function openEdit(r){ form.value = { ...r }; showModal.value = true }
function closeModal(){ showModal.value = false }
function save(){
  const payload = {
    id: form.value.id || undefined,
    userId: form.value.userId,
    date: form.value.date || new Date().toISOString().split('T')[0],
    checkIn: form.value.checkIn,
    checkOut: form.value.checkOut,
    status: form.value.status,
  }
  saveRecord('attendance', payload)
  recordsRaw.value = getAllRecords('attendance')
  showModal.value = false
}
function del(r){ if(confirm('Delete record?')) { deleteRecord('attendance', r.id); recordsRaw.value = getAllRecords('attendance') } }
</script>

<style scoped></style>
