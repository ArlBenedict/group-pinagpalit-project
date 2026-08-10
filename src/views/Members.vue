<template>
  <AppLayout>
    <div>
      <div class="topbar"><h2 style="margin:0">Members</h2></div>

      <div class="card">
        <CrudTable :columns="columns" :rows="members" @add="openAdd" @edit="openEdit" @delete="del" />
      </div>

      <ModalForm v-if="showModal" title="Member" @cancel="closeModal" @save="save">
        <div class="form-row">
          <div class="form-control" style="flex:1"><label>Name</label><input v-model="form.name" /></div>
          <div class="form-control" style="flex:1"><label>Email</label><input v-model="form.email" /></div>
        </div>
        <div class="form-row">
          <div class="form-control" style="flex:1"><label>Phone</label><input v-model="form.phone" /></div>
          <div class="form-control" style="flex:1"><label>Plan</label><input v-model="form.plan" /></div>
        </div>
        <div class="form-row">
          <div class="form-control" style="flex:1">
            <label>Workout Plan</label>
            <select v-model.number="form.workoutPlanId">
              <option value="">None</option>
              <option v-for="plan in workoutPlans" :key="plan.id" :value="plan.id">{{ plan.title }}</option>
            </select>
          </div>
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
import { getAllRecords, saveRecord, deleteRecord, saveUser, getPlanDetails } from '../stores/mockData'

const workoutPlans = [
  { id: 1, title: 'Full Body Starter', difficulty: 'Beginner', trainer: 'Jordan', exercises: [{ name: 'Squat', sets: 3, reps: 10 }, { name: 'Push-up', sets: 3, reps: 12 }] },
]
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'plan', label: 'Plan' },
  { key: 'workoutPlan', label: 'Workout Plan' },
]

const members = ref(getAllRecords('members'))
const showModal = ref(false)
const form = ref({ id: null, name: '', email: '', phone: '', plan: '', workoutPlanId: '', workoutPlan: '' })

const availableWorkoutPlanTitles = computed(() => {
  return workoutPlans.reduce((map, plan) => {
    map[plan.id] = plan.title
    return map
  }, {})
})

function openAdd() {
  form.value = { id: null, name: '', email: '', phone: '', plan: '', workoutPlanId: '', workoutPlan: '' }
  showModal.value = true
}

function openEdit(row) {
  form.value = { ...row }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveMembership(userId, plan) {
  if (!userId) return
  if (!plan) return
  const planDetails = getPlanDetails(plan)
  const today = new Date()
  const end = new Date(today)
  end.setMonth(end.getMonth() + planDetails.durationMonths)
  saveRecord('memberships', {
    userId,
    plan: planDetails.title,
    status: 'Active',
    start: today.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    price: planDetails.price,
    benefits: planDetails.benefits,
  })
}

function saveWorkoutAssignment(userId, workoutPlanId) {
  if (!userId) return
  if (!workoutPlanId) return
  saveRecord('workoutAssignments', { userId, workoutPlanId })
}

function save() {
  const planTitle = workoutPlans.find(p => p.id === form.value.workoutPlanId)?.title || ''
  form.value.workoutPlan = planTitle
  const savedUser = saveUser({
    id: form.value.id ? String(form.value.id) : undefined,
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    role: 'USER',
  })

  if (!savedUser) {
    showModal.value = false
    return
  }

  const memberPayload = {
    id: savedUser.id,
    userId: savedUser.id,
    name: savedUser.name,
    email: savedUser.email,
    phone: savedUser.phone,
    plan: form.value.plan,
    workoutPlanId: form.value.workoutPlanId,
    workoutPlan: planTitle,
  }

  saveRecord('members', memberPayload)

  if (form.value.plan) {
    saveMembership(savedUser.id, form.value.plan)
  }
  if (form.value.workoutPlanId) {
    saveWorkoutAssignment(savedUser.id, form.value.workoutPlanId)
  }

  members.value = getAllRecords('members')
  showModal.value = false
}

function del(row) {
  if (confirm('Delete member?')) {
    deleteRecord('members', row.id)
    members.value = getAllRecords('members')
  }
}
</script>

<style scoped></style>
