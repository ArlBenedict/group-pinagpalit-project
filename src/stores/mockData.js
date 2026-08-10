import { ref } from 'vue'

export const dataVersion = ref(0)

const PLAN_DETAILS = {
  Gold: {
    title: 'Gold',
    price: 1500,
    durationMonths: 6,
    benefits: ['Unlimited gym access', 'Free group classes', 'Access to pool', '1 free PT session/month'],
    description: 'Best value with premium perks for dedicated members.',
  },
  Premium: {
    title: 'Premium',
    price: 2000,
    durationMonths: 6,
    benefits: ['Unlimited gym access', 'Free group classes', 'Access to pool', 'Priority booking'],
    description: 'Premium membership with extra benefits and priority access.',
  },
  Silver: {
    title: 'Silver',
    price: 1000,
    durationMonths: 6,
    benefits: ['Unlimited gym access', 'Access to group classes'],
    description: 'Affordable membership for regular gym use.',
  },
}

export function getPlanDetails(plan) {
  return PLAN_DETAILS[plan] || {
    title: plan || 'Custom',
    price: 0,
    durationMonths: 6,
    benefits: ['Standard gym access'],
    description: 'Custom or unknown plan.',
  }
}

export function getAvailablePlans() {
  return Object.values(PLAN_DETAILS)
}

const COLLECTION_KEYS = {
  users: 'fithit_users',
  memberships: 'fithit_memberships',
  payments: 'fithit_payments',
  attendance: 'fithit_attendance',
  workoutAssignments: 'fithit_workoutAssignments',
  members: 'fithit_members',
}

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readCollection(key) {
  const raw = localStorage.getItem(key)
  return safeParse(raw)
}

function writeCollection(key, items) {
  localStorage.setItem(key, JSON.stringify(items))
}

function getCollectionKey(collectionName) {
  return COLLECTION_KEYS[collectionName] || null
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getAllRecords(collectionName) {
  if (collectionName === 'members') {
    const raw = localStorage.getItem(COLLECTION_KEYS.members)
    if (raw) return safeParse(raw)
    return readCollection(COLLECTION_KEYS.users)
  }
  const key = getCollectionKey(collectionName)
  if (!key) return []
  return readCollection(key)
}

export function getUserRecords(userId, collectionName) {
  if (!userId) return []
  return getAllRecords(collectionName).filter(record => record.userId === userId)
}

export function getCurrentUserId(auth) {
  return auth?.user?.id || null
}

export function findUserByEmail(email) {
  if (!email) return null
  const lowerEmail = email.toLowerCase()
  return getAllRecords('users').find(user =>
    user.email?.toLowerCase() === lowerEmail || user.name?.toLowerCase() === lowerEmail
  ) || null
}

export function saveRecord(collectionName, record) {
  const key = getCollectionKey(collectionName)
  if (!key || !record || typeof record !== 'object') return null
  const items = getAllRecords(collectionName)
  const existingIndex = items.findIndex(item => item.id === record.id)
  if (existingIndex !== -1) {
    items[existingIndex] = { ...items[existingIndex], ...record }
  } else {
    items.unshift({ ...record, id: record.id || createId() })
  }
  writeCollection(key, items)
  dataVersion.value += 1
  return items[existingIndex] ? items[existingIndex].id : items[0].id
}

export function deleteRecord(collectionName, id) {
  const key = getCollectionKey(collectionName)
  if (!key) return
  const items = getAllRecords(collectionName)
  const filtered = items.filter(item => item.id !== id)
  writeCollection(key, filtered)
  dataVersion.value += 1
}

export function saveUser(user) {
  if (!user || !user.email) return null
  const existing = findUserByEmail(user.email)
  const updated = { ...existing, ...user, id: existing?.id || user.id || createId(), role: user.role || existing?.role || 'USER' }
  saveRecord('users', updated)
  saveRecord('members', updated)
  return updated
}

export function ensureUserRecord(user) {
  if (!user || !user.email) return null
  const existing = findUserByEmail(user.email)
  if (existing) {
    const updated = { ...existing, ...user, id: existing.id }
    saveRecord('users', updated)
    saveRecord('members', updated)
    return updated
  }
  return saveUser(user)
}

export function createOrUpdateMembershipFromPayment(payment) {
  if (!payment || !payment.userId || !payment.plan) return null
  const existing = getAllRecords('memberships').find(m => m.userId === payment.userId)
  const planDetails = getPlanDetails(payment.plan)
  const today = new Date()
  const end = new Date(today)
  end.setMonth(end.getMonth() + planDetails.durationMonths)
  const membership = {
    id: existing?.id || createId(),
    userId: payment.userId,
    plan: planDetails.title,
    status: 'Active',
    start: today.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    price: planDetails.price,
    benefits: planDetails.benefits,
  }
  saveRecord('memberships', membership)
  return membership
}

export function createOrUpdatePendingMembership(userId, plan) {
  if (!userId || !plan) return null
  const existing = getAllRecords('memberships').find(m => m.userId === userId)
  const planDetails = getPlanDetails(plan)
  const today = new Date()
  const end = new Date(today)
  end.setMonth(end.getMonth() + planDetails.durationMonths)
  const membership = {
    id: existing?.id || createId(),
    userId,
    plan: planDetails.title,
    status: 'Pending',
    start: today.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    price: planDetails.price,
    benefits: planDetails.benefits,
  }
  saveRecord('memberships', membership)
  return membership
}

export function approvePayment(paymentId) {
  if (!paymentId) return null
  const payment = getAllRecords('payments').find(p => p.id === paymentId)
  if (!payment) return null
  saveRecord('payments', { ...payment, status: 'Paid' })
  return createOrUpdateMembershipFromPayment({ ...payment, status: 'Paid' })
}

export function migrateMembers() {
  const existingUsers = getAllRecords('users')
  const existingMembers = getAllRecords('members')
  if (existingUsers.length > 0 || existingMembers.length > 0) return

  const raw = localStorage.getItem(COLLECTION_KEYS.members)
  const oldMembers = safeParse(raw)
  if (!oldMembers.length) return

  const users = oldMembers.map(member => ({
    id: member.id ? String(member.id) : createId(),
    name: member.name || '',
    email: member.email || '',
    phone: member.phone || '',
    plan: member.plan || '',
    role: 'USER',
  }))

  writeCollection(COLLECTION_KEYS.users, users)
  writeCollection(COLLECTION_KEYS.members, users)
}

export function migrateWorkoutAssignments() {
  const raw = localStorage.getItem(COLLECTION_KEYS.members)
  const oldMembers = safeParse(raw)
  if (!oldMembers.length) return

  const existingAssignments = getAllRecords('workoutAssignments')
  if (existingAssignments.length > 0) return

  const assignments = []
  oldMembers.forEach(member => {
    if (member.workoutPlanId) {
      const userId = member.id ? String(member.id) : null
      if (userId) {
        assignments.push({ id: createId(), userId, workoutPlanId: member.workoutPlanId })
      }
    }
  })

  if (assignments.length) {
    writeCollection(COLLECTION_KEYS.workoutAssignments, assignments)
  }
}

export function migrateMembershipsFromMembers() {
  const raw = localStorage.getItem(COLLECTION_KEYS.members)
  const oldMembers = safeParse(raw)
  if (!oldMembers.length) return

  const existingMemberships = getAllRecords('memberships')
  if (existingMemberships.length > 0) return

  const memberships = oldMembers
    .filter(member => member.plan)
    .map(member => ({
      id: createId(),
      userId: member.id ? String(member.id) : createId(),
      plan: member.plan,
      status: 'Active',
      start: member.start || '2026-07-01',
      end: member.end || '2026-12-31',
      price: member.plan === 'Gold' ? 1500 : 1000,
      benefits: member.plan === 'Gold'
        ? ['Unlimited gym access', 'Free group classes', 'Access to pool', '1 free PT session/month']
        : ['Unlimited gym access', 'Access to group classes'],
    }))

  if (memberships.length) {
    writeCollection(COLLECTION_KEYS.memberships, memberships)
  }
}

export function initializeMockData() {
  migrateMembers()
  migrateMembershipsFromMembers()
  migrateWorkoutAssignments()
}

export { COLLECTION_KEYS }
