<template>
  <div class="auth-page auth-page--register">
    <div class="auth-layout">
      <section class="auth-story">
        <div class="auth-mark">FIT<span>HIT</span></div>
        <div class="auth-story-content">
          <div class="eyebrow">YOUR NEXT CHAPTER / 02</div>
          <h1>Start your<br /><em>fit journey.</em></h1>
          <p>Build a rhythm that lasts. Your member space is ready when you are.</p>
        </div>
        <div class="auth-story-foot">
          <span>MOVE WITH PURPOSE</span><span>ONE SESSION AT A TIME</span>
        </div>
      </section>
      <section class="auth-panel">
        <div class="auth-panel-top">
          <span>CREATE PROFILE</span
          ><router-link to="/login">Already a member? Sign in</router-link>
        </div>
        <div class="auth-card">
          <div class="auth-heading">
            <div class="eyebrow">JOIN FIT HIT</div>
            <h2>Make consistency your advantage.</h2>
            <p>Set up your member details to access your training space.</p>
          </div>
          <form @submit.prevent="register">
            <div class="form-row">
              <div class="form-control" style="flex: 1">
                <label for="register-name">Full name</label
                ><input id="register-name" v-model="name" autocomplete="name" />
              </div>
              <div class="form-control" style="flex: 1">
                <label for="register-phone">Phone</label
                ><input id="register-phone" v-model="phone" autocomplete="tel" />
              </div>
            </div>
            <div class="form-control">
              <label for="register-email">Email</label
              ><input id="register-email" v-model="email" autocomplete="email" />
            </div>
            <div class="form-row">
              <div class="form-control" style="flex: 1">
                <label for="register-password">Password</label>
                <div class="password-field">
                  <input
                    id="register-password"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    autocomplete="new-password"
                  /><button
                    type="button"
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                  >
                    {{ showPassword ? 'Hide' : 'Show' }}
                  </button>
                </div>
              </div>
              <div class="form-control" style="flex: 1">
                <label for="register-confirm">Confirm</label
                ><input
                  id="register-confirm"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="confirm"
                  autocomplete="new-password"
                />
              </div>
            </div>
            <div v-if="error" class="validation-summary">{{ error }}</div>
            <button class="btn auth-submit" type="submit">Create account <span>-></span></button>
          </form>
          <div class="auth-panel-bottom">Your details stay within FitHit member access</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { saveUser } from '../stores/mockData'

defineOptions({ name: 'RegisterView' })

const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const showPassword = ref(false)
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
