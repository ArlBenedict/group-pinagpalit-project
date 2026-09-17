<template>
  <div class="auth-page auth-page--login">
    <div class="auth-layout">
      <section class="auth-story">
        <div class="auth-mark">FIT<span>HIT</span></div>
        <div class="auth-story-content">
          <div class="eyebrow">MEMBER PLATFORM / 01</div>
          <h1>Train smart.<br /><em>Live strong.</em></h1>
          <p>Your place to stay consistent, see your progress, and keep moving forward.</p>
        </div>
        <div class="auth-story-foot">
          <span>EST. 2026</span><span>FITNESS MANAGEMENT, REFINED</span>
        </div>
      </section>
      <section class="auth-panel">
        <div class="auth-panel-top">
          <span>WELCOME BACK</span><router-link to="/register">New here? Join FitHit</router-link>
        </div>
        <div class="auth-card">
          <div class="auth-heading">
            <div class="eyebrow">SIGN IN</div>
            <h2>Ready for your next session?</h2>
            <p>Access your member space and pick up where you left off.</p>
          </div>
          <form @submit.prevent="login">
            <div class="form-control">
              <label for="login-email">Email or username</label>
              <input
                id="login-email"
                v-model="email"
                placeholder="you@domain.com"
                autocomplete="username"
              />
              <div v-if="emailError" class="validation-message">{{ emailError }}</div>
            </div>
            <div class="form-control">
              <label for="login-password">Password</label>
              <div class="password-field">
                <input
                  id="login-password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                />
                <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <div v-if="passwordError" class="validation-message">{{ passwordError }}</div>
            </div>
            <button class="btn auth-submit" type="submit">Sign in <span>-></span></button>
          </form>
          <div v-if="errorMessage" class="validation-summary">{{ errorMessage }}</div>
          <div class="auth-panel-bottom">Secure member access <span>*</span> FitHit platform</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

defineOptions({ name: 'LoginView' })

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const emailError = ref('')
const passwordError = ref('')
const errorMessage = ref('')
const showPassword = ref(false)

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

async function login() {
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
.auth-page--login {
  padding: 0;
  background: #071426;
}
.auth-layout {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(420px, 0.85fr);
}
.auth-story {
  padding: clamp(28px, 5vw, 76px);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #071426 0%, #102a42 72%, #d94f0c 180%);
}
.auth-story::after {
  content: '';
  position: absolute;
  inset: 22% -15% -15% 30%;
  background: url('../assets/fithit-gym-bg.png') center/cover no-repeat;
  opacity: 0.16;
  mix-blend-mode: screen;
  transform: rotate(-5deg);
}
.auth-mark {
  position: relative;
  z-index: 1;
  font-size: 23px;
  font-weight: 900;
  letter-spacing: -0.06em;
}
.auth-mark span {
  color: #ff7a1a;
}
.auth-story-content {
  position: relative;
  z-index: 1;
  max-width: 650px;
  margin: auto 0;
  padding: 80px 0;
}
.auth-story h1 {
  margin: 0;
  font-size: clamp(54px, 8vw, 112px);
  letter-spacing: -0.08em;
  line-height: 0.82;
  text-transform: uppercase;
}
.auth-story h1 em {
  color: #ff7a1a;
  font-style: normal;
}
.auth-story p {
  max-width: 390px;
  margin: 30px 0 0;
  color: #b8c6d6;
  line-height: 1.6;
  font-size: 16px;
}
.auth-story-foot {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #7890ad;
  font-size: 10px;
  letter-spacing: 0.16em;
  font-weight: 700;
}
.auth-panel {
  background: transparent;
  padding: clamp(24px, 5vw, 76px);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}
.auth-panel-top {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
}
.auth-panel-top a {
  color: var(--accent);
  text-decoration: none;
  letter-spacing: 0;
  font-size: 12px;
  text-transform: none;
}
.auth-card {
  max-width: 460px;
  width: 100%;
  margin: auto;
  background: rgba(7, 20, 38, 0.74);
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(4px);
}
.auth-heading .eyebrow {
  margin-bottom: 16px;
}
.auth-heading h2 {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(30px, 4vw, 48px);
  letter-spacing: -0.07em;
  line-height: 0.98;
}
.auth-heading p {
  color: #d5dfeb;
  line-height: 1.6;
  margin: 18px 0 34px;
}
.auth-card .form-control {
  margin-bottom: 22px;
}
.auth-card .form-control label {
  color: #f1f5f9;
  font-size: 12px;
  font-weight: 700;
}
.password-field {
  position: relative;
}
.password-field input {
  width: 100%;
  padding-right: 68px;
}
.password-toggle {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: 0;
  background: none;
  color: var(--accent);
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}
.auth-submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 18px;
  margin-top: 4px;
}
.auth-submit span {
  font-size: 20px;
  line-height: 0;
}
.auth-panel-bottom {
  color: #c2cfdd;
  font-size: 11px;
  margin-top: 28px;
  text-align: center;
}
.auth-panel-bottom span {
  margin: 0 7px;
  color: var(--accent);
}
.validation-message {
  margin-top: 6px;
  color: #fca5a5;
  font-size: 13px;
}
.validation-summary {
  margin-top: 16px;
  color: #fecaca;
  font-size: 14px;
  text-align: center;
}
@media (max-width: 820px) {
  .auth-layout {
    grid-template-columns: 1fr;
  }
  .auth-story {
    min-height: 330px;
    padding: 28px 24px;
  }
  .auth-story-content {
    padding: 48px 0 24px;
    margin: auto 0 0;
  }
  .auth-story h1 {
    font-size: clamp(52px, 15vw, 90px);
  }
  .auth-story-foot {
    display: none;
  }
  .auth-panel {
    min-height: 570px;
    padding: 28px 24px 44px;
  }
}
</style>
