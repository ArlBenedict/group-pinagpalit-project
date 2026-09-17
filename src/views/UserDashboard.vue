<template>
  <AppLayout>
    <main class="user-page dashboard-page">
      <ScrollReveal>
        <section ref="heroSection" class="dashboard-hero">
          <div class="hero-copy">
            <div class="hero-meta">
              <span>FIT HIT / 01</span><span>{{ greeting }}</span>
            </div>
            <div class="eyebrow">MEMBER SPACE / READY WHEN YOU ARE</div>
            <h1>Ready to<br /><em>train?</em></h1>
            <p>Keep your rhythm. Every session is a vote for the person you are becoming.</p>
            <button class="btn hero-cta" @click="goToMembership">
              View my membership <span>-></span>
            </button>
          </div>
          <div class="hero-mark">
            <span><b>F</b><b>H</b></span
            ><small>FIT<br />HIT</small>
          </div>
          <div class="hero-coordinate" aria-hidden="true">
            09 / 15<br /><span>MEMBER EDITION</span>
          </div>
          <div class="scroll-cue" aria-hidden="true"><span></span>SCROLL TO EXPLORE</div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section class="story-scene consistency-scene">
          <div class="scene-index">01</div>
          <div class="consistency-copy">
            <div class="section-label">CONSISTENCY / THE ADVANTAGE</div>
            <h2>Consistency<br /><em>beats</em><br />motivation.</h2>
            <p>Your rhythm is built from the sessions you actually show up for.</p>
          </div>
          <div class="consistency-stat">
            <div class="stat-line"></div>
            <strong><AnimatedNumber :value="attendance.month" /></strong>
            <span>VISITS<br />THIS MONTH</span>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section class="story-scene week-scene">
          <div class="scene-header">
            <div>
              <div class="section-label">02 / YOUR WEEK</div>
              <h2 class="section-title">Show up for yourself.</h2>
            </div>
            <div class="week-streak">
              <strong><AnimatedNumber :value="weeklyStreak" /></strong
              ><span>ACTIVE DAYS<br />THIS WEEK</span>
            </div>
          </div>
          <div class="week-visual">
            <div
              v-for="day in weekDays"
              :key="day.key"
              class="week-column"
              :class="{ attended: day.attended }"
              :style="{
                '--day-delay': `${day.index * 70}ms`,
                '--bar-height': day.attended ? '72%' : '18%',
              }"
            >
              <div class="week-bar"><span></span></div>
              <strong>{{ day.attended ? '✓' : '—' }}</strong>
              <small>{{ day.label }}</small>
              <em>{{ day.date }}</em>
            </div>
          </div>
          <p class="scene-note">
            {{
              attendance.month
                ? 'Your recent check-ins, in one clear rhythm.'
                : 'Your first check-in will set the rhythm.'
            }}
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section class="story-scene membership-scene">
          <div class="scene-index">03</div>
          <div class="membership-editorial">
            <div class="section-label">YOUR MEMBERSHIP / ACCESS</div>
            <h2>{{ membership.plan }}</h2>
            <span class="status-pill">{{ membership.status }}</span>
            <div class="membership-rule"></div>
            <p>
              {{
                membership.end
                  ? `Access through ${membership.end}`
                  : 'Your membership details will appear here.'
              }}
            </p>
          </div>
          <div class="membership-days">
            <strong><AnimatedNumber :value="membership.daysRemaining" /></strong>
            <span>DAYS<br />REMAINING</span>
            <div
              class="editorial-progress"
              :style="{ '--progress-target': membership.progress + '%' }"
            >
              <span></span>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section ref="workoutScene" class="story-scene workout-scene">
          <div class="scene-index">04</div>
          <div class="workout-intro">
            <div class="section-label">WORKOUT SPOTLIGHT / TODAY</div>
            <h2>Put the plan<br /><em>into motion.</em></h2>
          </div>
          <div v-if="assignedPlan" class="workout-editorial">
            <div class="workout-orbit"><span>FH</span></div>
            <div class="workout-details">
              <div class="membership-kicker">ASSIGNED / {{ assignedPlan.difficulty }}</div>
              <h3>{{ assignedPlan.title }}</h3>
              <div class="workout-facts">
                <span
                  ><b>{{ assignedPlan.exercises.length }}</b> EXERCISES</span
                ><span
                  ><b>{{ assignedPlan.trainer }}</b> TRAINER</span
                ><span><b>ASSIGNED</b> STATUS</span>
              </div>
            </div>
          </div>
          <div v-else class="workout-editorial workout-empty">
            <div class="workout-orbit"><span>--</span></div>
            <div class="workout-details">
              <div class="membership-kicker">WAITING FOR YOUR PLAN</div>
              <h3>No workout assigned yet.</h3>
              <p>Your trainer or administrator will add your first plan here.</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section class="story-scene activity-scene">
          <div class="scene-index">05</div>
          <div class="section-label">RECENT ACTIVITY / YOUR RECORD</div>
          <h2 class="section-title">Momentum,<br /><em>recorded.</em></h2>
          <div v-if="activities.length" class="editorial-timeline">
            <div
              v-for="(activity, index) in activities"
              :key="activity.id"
              class="editorial-activity"
              :style="{ '--activity-delay': `${index * 90}ms` }"
            >
              <span class="timeline-marker"></span>
              <div>
                <strong>{{ activity.title }}</strong>
                <p>{{ activity.detail }}</p>
              </div>
              <time>{{ activity.date }}</time>
            </div>
          </div>
          <div v-else class="scene-empty">
            <strong>Your story starts here.</strong
            ><span>Check in or make a payment to see your activity appear.</span>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section class="story-scene inside-scene">
          <div class="scene-index">06</div>
          <div class="inside-heading">
            <div class="section-label">INSIDE FIT HIT / COMMUNITY</div>
            <h2>Stay in<br /><em>the loop.</em></h2>
          </div>
          <div class="inside-feed">
            <article
              v-for="announcement in announcements"
              :key="announcement.id"
              class="inside-item"
              :style="{ '--announcement-delay': `${announcement.id * 90}ms` }"
            >
              <span class="inside-number">0{{ announcement.id }}</span>
              <div>
                <small>{{ announcement.date }}</small>
                <h3>{{ announcement.title }}</h3>
                <p>{{ announcement.body }}</p>
              </div>
            </article>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section class="motivation-scene">
          <div class="section-label">FIT HIT / KEEP SHOWING UP</div>
          <h2><span>Show up.</span><span>Do the work.</span><em>Keep moving.</em></h2>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section class="dashboard-final final-scene">
          <div class="final-grid" aria-hidden="true"></div>
          <div class="eyebrow">FIT HIT / 07 / KEEP GOING</div>
          <h2>Build your<br /><em>next win.</em></h2>
          <div class="final-mark">FH</div>
        </section>
      </ScrollReveal>
    </main>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import ScrollReveal from '../components/ScrollReveal.vue'
import AnimatedNumber from '../components/AnimatedNumber.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { formatPHP } from '../utils/currency'
import { getAllRecords, getUserRecords, getCurrentUserId, dataVersion } from '../stores/mockData'

const auth = useAuthStore()
const router = useRouter()
const heroSection = ref(null)
const workoutScene = ref(null)
let parallaxFrame

function updateHeroParallax() {
  if (!heroSection.value) return
  const shift = Math.min(70, Math.max(-10, window.scrollY * 0.12))
  const exitProgress = Math.min(1, Math.max(0, window.scrollY / 520))
  heroSection.value.style.setProperty('--hero-shift', `${shift}px`)
  heroSection.value.style.setProperty('--hero-copy-opacity', `${1 - exitProgress * 0.4}`)
  heroSection.value.style.setProperty('--hero-copy-shift', `${exitProgress * -18}px`)
  if (workoutScene.value) {
    const bounds = workoutScene.value.getBoundingClientRect()
    const progress = Math.min(
      1,
      Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)),
    )
    workoutScene.value.style.setProperty('--workout-shift', `${Math.round(progress * -110)}px`)
  }
  parallaxFrame = undefined
}

function handleScroll() {
  if (parallaxFrame === undefined) parallaxFrame = requestAnimationFrame(updateHeroParallax)
}

onMounted(() => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    updateHeroParallax()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  cancelAnimationFrame(parallaxFrame)
})
function goToMembership() {
  router.push('/my-membership')
}
const displayName = computed(() => (auth.user && auth.user.name ? auth.user.name : 'Member'))
const currentUserId = computed(() => getCurrentUserId(auth))

const membershipRecord = computed(() => {
  dataVersion.value
  const records = getUserRecords(currentUserId.value, 'memberships')
  return records[0] || null
})

const paymentRecords = computed(() => getUserRecords(currentUserId.value, 'payments'))
const attendanceRecords = computed(() => getUserRecords(currentUserId.value, 'attendance'))
const workoutAssignments = computed(() => getUserRecords(currentUserId.value, 'workoutAssignments'))
const announcements = [
  {
    id: 1,
    title: 'Holiday Hours',
    date: '2026-08-01',
    body: 'We will be closed on public holidays.',
  },
  {
    id: 2,
    title: 'New Trainer',
    date: '2026-07-20',
    body: 'Welcome Priya - new yoga classes added.',
  },
]
const greeting = computed(() => (new Date().getHours() < 12 ? 'GOOD MORNING' : 'GOOD TO SEE YOU'))

const membership = computed(() => {
  if (!membershipRecord.value) {
    return {
      plan: 'No active membership',
      price: '',
      start: '',
      end: '',
      status: 'Inactive',
      daysRemaining: 0,
      progress: 0,
    }
  }
  const endDate = membershipRecord.value.end
    ? new Date(`${membershipRecord.value.end}T23:59:59`)
    : null
  const startDate = membershipRecord.value.start
    ? new Date(`${membershipRecord.value.start}T00:00:00`)
    : null
  const daysRemaining = endDate ? Math.max(0, Math.ceil((endDate - new Date()) / 86400000)) : 0
  const duration =
    endDate && startDate ? Math.max(1, Math.ceil((endDate - startDate) / 86400000)) : 1
  return {
    plan: membershipRecord.value.plan || 'No active membership',
    price: membershipRecord.value.price ? formatPHP(membershipRecord.value.price) : '',
    start: membershipRecord.value.start || '-',
    end: membershipRecord.value.end || '-',
    status: membershipRecord.value.status || 'Inactive',
    daysRemaining,
    progress: Math.min(100, Math.max(0, Math.round((daysRemaining / duration) * 100))),
  }
})

const attendance = computed(() => {
  const count = attendanceRecords.value.length
  return { month: count, goal: 20 }
})

const attendancePercent = computed(() => {
  if (!attendance.value?.goal) return 0
  return Math.round((attendance.value.month / attendance.value.goal) * 100)
})

const recentCheckins = computed(() => {
  return attendanceRecords.value
    .slice(0, 5)
    .map((record) => ({ id: record.id, date: record.date, checkin: record.checkIn }))
})

const lastPayment = computed(() => {
  const sorted = [...paymentRecords.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  const latest = sorted[0]
  if (!latest) return { date: '-', amount: '-', status: 'None' }
  return {
    date: latest.date || '-',
    amount: latest.amount ? formatPHP(latest.amount) : formatPHP(0),
    status: latest.status || 'Pending',
  }
})

const weekDays = computed(() => {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - 6)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    const key = date.toISOString().split('T')[0]
    return {
      index,
      key,
      label: date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
      date: date.getDate(),
      attended: attendanceRecords.value.some((record) => record.date === key),
    }
  })
})

const weeklyStreak = computed(() => weekDays.value.filter((day) => day.attended).length)

const assignedPlan = computed(() => {
  const member = getAllRecords('members').find(
    (record) => record.id === currentUserId.value || record.userId === currentUserId.value,
  )
  const assignment = workoutAssignments.value[0]
  if (!member?.workoutPlanId && !assignment?.workoutPlanId) return null
  const planId = member?.workoutPlanId || assignment.workoutPlanId
  return (
    [
      {
        id: 1,
        title: 'Full Body Starter',
        difficulty: 'Beginner',
        trainer: 'Jordan',
        exercises: [{ name: 'Squat' }, { name: 'Push-up' }],
      },
    ].find((plan) => plan.id === planId) || null
  )
})

const activities = computed(() =>
  [
    ...attendanceRecords.value.slice(0, 3).map((record) => ({
      id: `attendance-${record.id}`,
      title: 'Checked in',
      detail: `${record.date} - ${record.checkIn}`,
      date: record.date,
    })),
    ...paymentRecords.value.slice(0, 2).map((record) => ({
      id: `payment-${record.id}`,
      title: 'Payment recorded',
      detail: `${record.status} - ${formatPHP(record.amount || 0)}`,
      date: record.date,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5),
)
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(249, 115, 22, 0.12);
  color: var(--accent);
  font-weight: 600;
}
.progress {
  height: 8px;
  background: var(--surface-strong);
  border-radius: 8px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #ffbb88);
  border-radius: 8px;
}
.card h3 {
  margin: 0 0 8px 0;
}
.card .value {
  font-size: 20px;
}
.btn.ghost {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 8px 10px;
  border-radius: 8px;
}
.card-row {
  gap: 16px;
}
@media (max-width: 900px) {
  .card-row {
    grid-template-columns: 1fr;
  }
}
</style>
