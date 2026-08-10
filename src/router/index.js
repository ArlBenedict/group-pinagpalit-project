import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/user', name: 'UserDashboard', component: () => import('../views/UserDashboard.vue'), meta: { requiresAuth: true, role: 'USER' } },
  { path: '/my-membership', name: 'MyMembership', component: () => import('../views/MyMembership.vue'), meta: { requiresAuth: true, role: 'USER' } },
  { path: '/my-attendance', name: 'MyAttendance', component: () => import('../views/MyAttendance.vue'), meta: { requiresAuth: true, role: 'USER' } },
  { path: '/my-payments', name: 'MyPayments', component: () => import('../views/MyPayments.vue'), meta: { requiresAuth: true, role: 'USER' } },
  { path: '/workout-plans', name: 'WorkoutPlans', component: () => import('../views/WorkoutPlans.vue'), meta: { requiresAuth: true, role: 'USER' } },
  { path: '/announcements', name: 'Announcements', component: () => import('../views/Announcements.vue'), meta: { requiresAuth: true, role: 'USER' } },
  { path: '/profile', name: 'MyProfile', component: () => import('../views/MyProfile.vue'), meta: { requiresAuth: true, role: 'USER' } },
  { path: '/user-settings', name: 'UserSettings', component: () => import('../views/UserSettings.vue'), meta: { requiresAuth: true, role: 'USER' } },
  { path: '/members', name: 'Members', component: () => import('../views/Members.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/attendance', name: 'Attendance', component: () => import('../views/Attendance.vue'), meta: { requiresAuth: true } },
  { path: '/plans', name: 'Plans', component: () => import('../views/Plans.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/trainers', name: 'Trainers', component: () => import('../views/Trainers.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/equipment', name: 'Equipment', component: () => import('../views/Equipment.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/payments', name: 'Payments', component: () => import('../views/Payments.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/reports', name: 'Reports', component: () => import('../views/Reports.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
  { path: '/settings', name: 'Settings', component: () => import('../views/Settings.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard using localStorage to avoid Pinia import timing issues
router.beforeEach((to, from) => {
  const raw = localStorage.getItem('fithit_user')
  const user = raw ? JSON.parse(raw) : null

  // redirect authenticated users away from login/register
  if ((to.path === '/login' || to.path === '/register') && user) {
    return user.role === 'ADMIN' ? '/dashboard' : '/user'
  }

  if (to.meta && to.meta.requiresAuth) {
    if (!user) return '/login'
    if (to.meta.role && user.role !== to.meta.role) {
      // role mismatch: redirect to appropriate dashboard
      return user.role === 'ADMIN' ? '/dashboard' : '/user'
    }
  }
  return true
})

export default router
