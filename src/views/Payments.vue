<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Payments</h2></div>
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h3 style="margin:0">Payment Records</h3>
          <button class="btn" @click="openAdd">Add New</button>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Method</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in payments" :key="payment.id">
              <td>{{ payment.member }}</td>
              <td>{{ payment.plan || '-' }}</td>
              <td>{{ payment.amount }}</td>
              <td>{{ payment.date }}</td>
              <td>{{ payment.status }}</td>
              <td>{{ payment.method || '-' }}</td>
              <td>
                <button class="btn ghost" @click="approve(payment)" :disabled="payment.status === 'Paid'">Approve</button>
                <button class="btn ghost" @click="del(payment)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ModalForm v-if="showModal" title="Payment" @cancel="closeModal" @save="save">
        <div class="form-control">
          <label>Member</label>
          <select v-model="form.userId">
            <option value="">Select member</option>
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
          </select>
        </div>
        <div class="form-control" style="margin-top:12px">
          <label>Plan</label>
          <select v-model="form.plan">
            <option value="">Select plan</option>
            <option v-for="plan in plans" :key="plan.title" :value="plan.title">{{ plan.title }}</option>
          </select>
        </div>
        <div class="form-row" style="margin-top:12px">
          <div class="form-control" style="flex:1"><label>Amount</label><input v-model="form.amount" /></div>
          <div class="form-control" style="flex:1"><label>Date</label><input type="date" v-model="form.date" /></div>
        </div>
        <div class="form-control" style="margin-top:12px">
          <label>Method</label>
          <select v-model="form.method">
            <option value="">Select method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="GCash">GCash</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <div class="form-control" style="margin-top:12px">
          <label>Status</label>
          <select v-model="form.status">
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </ModalForm>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import ModalForm from '../components/ModalForm.vue'
import { ref, computed } from 'vue'
import { formatPHP } from '../utils/currency'
import { getAllRecords, deleteRecord, saveRecord, approvePayment, getAvailablePlans, dataVersion } from '../stores/mockData'

const paymentsRaw = ref(getAllRecords('payments'))
const users = ref(getAllRecords('users'))
const plans = ref(getAvailablePlans())
const payments = computed(() => {
  dataVersion.value
  return paymentsRaw.value.map(payment => ({
    ...payment,
    member: users.value.find(u => u.id === payment.userId)?.name || 'Unknown',
    amount: payment.amount ? formatPHP(payment.amount) : formatPHP(0),
  }))
})
const showModal = ref(false)
const form = ref({ id:null, userId:'', plan:'', amount:'', date:'', status:'Pending', method: '' })

function openAdd(){ form.value = { id:null, userId:'', amount:'', date:'', status:'Pending', method: '' }; showModal.value=true }
function openEdit(r){ form.value = {...r}; showModal.value=true }
function closeModal(){ showModal.value=false }
function save(){
  const payload = {
    id: form.value.id || undefined,
    userId: form.value.userId,
    amount: Number(form.value.amount) || plans.value.find(p => p.title === form.value.plan)?.price || 0,
    date: form.value.date || new Date().toISOString().split('T')[0],
    status: form.value.status || 'Pending',
    method: form.value.method || 'Cash',
    plan: form.value.plan || '',
  }
  saveRecord('payments', payload)
  paymentsRaw.value = getAllRecords('payments')
  showModal.value=false
}
function approve(r){
  if (!r || !r.id || r.status === 'Paid') return
  if (!confirm('Approve this payment and activate the membership?')) return
  approvePayment(r.id)
  paymentsRaw.value = getAllRecords('payments')
}
function del(r){ if(confirm('Delete payment?')) { deleteRecord('payments', r.id); paymentsRaw.value = getAllRecords('payments') } }
</script>

<style scoped></style>
