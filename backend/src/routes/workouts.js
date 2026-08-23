const express = require('express')
const router = express.Router()
const prisma = require('../db')

router.get('/', async (req, res) => {
  const items = await prisma.workoutAssignment.findMany({ include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } })
  res.json(items)
})

router.post('/', async (req, res) => {
  const { userId, workoutPlanId } = req.body
  try {
    const item = await prisma.workoutAssignment.create({ data: { userId, workoutPlanId } })
    res.json(item)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

module.exports = router
