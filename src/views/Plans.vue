<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Membership Plans</h2></div>
      <div class="card">
        <CrudTable :columns="columns" :rows="plans" @add="openAdd" @edit="openEdit" @delete="del" />
      </div>

      <ModalForm v-if="showModal" title="Plan" @cancel="closeModal" @save="save">
        <div class="form-control"><label>Title</label><input v-model="form.title" /></div>
        <div class="form-row">
          <div class="form-control" style="flex:1"><label>Price</label><input v-model="form.price" /></div>
          <div class="form-control" style="flex:1"><label>Duration (months)</label><input v-model="form.duration" /></div>
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
import { formatPHP } from '../utils/currency'
import { getAvailablePlans } from '../stores/mockData'

const columns = [{ key:'title', label:'Plan' }, { key:'price', label:'Price' }, { key:'duration', label:'Months' }]
const plans = ref(getAvailablePlans().map(plan => ({ ...plan, price: formatPHP(plan.price) })))
const showModal = ref(false)
const form = ref({ id:null, title:'', price:'', duration:'' })
function openAdd(){ form.value = { id:null, title:'', price:'', duration:'' }; showModal.value=true }
function openEdit(r){ form.value = {...r}; showModal.value=true }
function closeModal(){ showModal.value=false }
function save(){ if(!form.value.id){ form.value.id=Date.now(); plans.value.unshift({...form.value}) } else { const i=plans.value.findIndex(p=>p.id===form.value.id); if(i!==-1) plans.value[i] = {...form.value} } showModal.value=false }
function del(r){ if(confirm('Delete plan?')) plans.value = plans.value.filter(p=>p.id!==r.id) }
</script>

<style scoped></style>
