<template>
	<div class="auth-page">
		<div class="auth-card">
			<div class="card">
				<h2 style="margin:0 0 6px 0">Welcome back</h2>
				<div class="muted" style="margin-bottom:16px">Sign in to manage your gym</div>
				<div class="form-control">
					<label>Email</label>
					<input v-model="email" placeholder="you@domain.com" />
					<div v-if="emailError" class="validation-message">{{ emailError }}</div>
				</div>
				<div class="form-control">
					<label>Password</label>
					<input type="password" v-model="password" placeholder="••••••" />
					<div v-if="passwordError" class="validation-message">{{ passwordError }}</div>
				</div>
				<div style="display:flex;justify-content:space-between;align-items:center">
					<div class="muted">Forgot password?</div>
					<button class="btn" @click="login">Sign in</button>
				</div>
				<div style="text-align:center;margin-top:12px">
					<router-link to="/register" class="muted">Create an account</router-link>
				</div>
				<div v-if="errorMessage" class="validation-summary">{{ errorMessage }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const emailError = ref('')
const passwordError = ref('')
const errorMessage = ref('')

function validate() {
	emailError.value = ''
	passwordError.value = ''
	errorMessage.value = ''

	let valid = true
	if (!email.value.trim()) {
		emailError.value = 'Email or username is required.'
		valid = false
	}
	if (!password.value.trim()) {
		passwordError.value = 'Password is required.'
		valid = false
	}
	return valid
}

async function login(){
	if (!validate()) {
		return
	}

	// perform mock login via auth store
	const u = auth.login({ email: email.value, password: password.value })
	if (!u) {
		errorMessage.value = 'Unable to sign in. Please check your credentials.'
		return
	}
	// redirect based on role
	if (u.role === 'ADMIN') await router.push('/dashboard')
	else await router.push('/user')
}
</script>

<style scoped>
.validation-message {
	margin-top:6px;
	color:#fca5a5;
	font-size:13px;
}
.validation-summary {
	margin-top:16px;
	color:#fecaca;
	font-size:14px;
	text-align:center;
}
</style>
