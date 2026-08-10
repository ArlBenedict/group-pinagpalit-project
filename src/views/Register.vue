<template>
	<div class="auth-page">
		<div class="auth-card">
			<div class="card">
				<h2 style="margin:0 0 6px 0">Create account</h2>
				<div class="muted" style="margin-bottom:16px">Register a new administrator (mock)</div>
				<div class="form-row">
					<div class="form-control" style="flex:1">
						<label>Full name</label>
						<input v-model="name" />
					</div>
					<div class="form-control" style="flex:1">
						<label>Phone</label>
						<input v-model="phone" />
					</div>
				</div>
				<div class="form-control">
					<label>Email</label>
					<input v-model="email" />
				</div>
				<div class="form-row">
					<div class="form-control" style="flex:1">
						<label>Password</label>
						<input type="password" v-model="password" />
					</div>
					<div class="form-control" style="flex:1">
						<label>Confirm</label>
						<input type="password" v-model="confirm" />
					</div>
				</div>
				<div style="display:flex;justify-content:flex-end">
					<button class="btn" @click="register">Create account</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { saveUser } from '../stores/mockData'

const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const router = useRouter()

function validate() {
  error.value = ''
  if (!name.value.trim()) {
    error.value = 'Full name is required.'
    return false
  }
  if (!email.value.trim()) {
    error.value = 'Email is required.'
    return false
  }
  if (!password.value.trim()) {
    error.value = 'Password is required.'
    return false
  }
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return false
  }
  return true
}

function register() {
  if (!validate()) return

  const normalizedEmail = email.value.trim()
  const newUser = {
    id: Date.now().toString(),
    name: name.value.trim(),
    email: normalizedEmail,
    phone: phone.value.trim(),
    password: password.value,
    role: normalizedEmail.toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
  }

  saveUser(newUser)
  alert('Account created successfully. Please sign in.')
  router.push('/login')
}
</script>

<style scoped></style>
