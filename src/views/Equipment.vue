<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Equipment</h2></div>
      <div class="card">
        <CrudTable :columns="columns" :rows="items" @add="openAdd" @edit="openEdit" @delete="del" />
      </div>

      <ModalForm v-if="showModal" title="Equipment" @cancel="closeModal" @save="save">
        <div class="form-control"><label>Item</label><input v-model="form.name" /></div>
        <div class="form-row">
          <div class="form-control" style="flex:1"><label>Status</label><input v-model="form.status" /></div>
          <div class="form-control" style="flex:1"><label>Location</label><input v-model="form.location" /></div>
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

const columns = [{ key:'name', label:'Item' }, { key:'status', label:'Status' }, { key:'location', label:'Location' }]
const items = ref([{ id:1, name:'Treadmill', status:'Good', location:'Zone A' }, { id:2, name:'Dumbbells', status:'Good', location:'Free Weights' }])
const showModal = ref(false)
const form = ref({ id:null, name:'', status:'', location:'' })
function openAdd(){ form.value = { id:null, name:'', status:'', location:'' }; showModal.value=true }
function openEdit(r){ form.value = {...r}; showModal.value=true }
function closeModal(){ showModal.value=false }
function save(){ if(!form.value.id){ form.value.id=Date.now(); items.value.unshift({...form.value}) } else { const i=items.value.findIndex(x=>x.id===form.value.id); if(i!==-1) items.value[i] = {...form.value} } showModal.value=false }
function del(r){ if(confirm('Delete item?')) items.value = items.value.filter(x=>x.id!==r.id) }
</script>

<style scoped></style>
