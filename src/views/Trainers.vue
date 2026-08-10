<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Trainers</h2></div>
      <div class="card">
        <CrudTable :columns="columns" :rows="trainers" @add="openAdd" @edit="openEdit" @delete="del" />
      </div>

      <ModalForm v-if="showModal" title="Trainer" @cancel="closeModal" @save="save">
        <div class="form-row">
          <div class="form-control" style="flex:1"><label>Name</label><input v-model="form.name" /></div>
          <div class="form-control" style="flex:1"><label>Specialty</label><input v-model="form.specialty" /></div>
        </div>
      </ModalForm>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import CrudTable from '../components/CrudTable.vue'
import ModalForm from '../components/ModalForm.vue'
import { ref } from 'vue'

const columns = [{ key:'name', label:'Name' }, { key:'specialty', label:'Specialty' }]
const trainers = ref([{ id:1, name:'Jordan Miles', specialty:'Strength' }, { id:2, name:'Priya Sharma', specialty:'Yoga' }])
const showModal = ref(false)
const form = ref({ id:null, name:'', specialty:'' })
function openAdd(){ form.value = { id:null, name:'', specialty:'' }; showModal.value=true }
function openEdit(r){ form.value = {...r}; showModal.value=true }
function closeModal(){ showModal.value=false }
function save(){ if(!form.value.id){ form.value.id = Date.now(); trainers.value.unshift({...form.value}) } else { const i=trainers.value.findIndex(t=>t.id===form.value.id); if(i!==-1) trainers.value[i] = {...form.value} } showModal.value=false }
function del(r){ if(confirm('Delete trainer?')) trainers.value = trainers.value.filter(t=>t.id!==r.id) }
</script>

<style scoped></style>
