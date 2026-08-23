const express = require('express')
const router = express.Router()
const prisma = require('../db')

router.get('/', async (req, res) => {
  const items = await prisma.attendance.findMany({ orderBy: { date: 'desc' }, include: { user: { select: { id: true, name: true } } } })
  res.json(items)
})

router.post('/', async (req, res) => {
  const { userId, date, status } = req.body
  try {
    const item = await prisma.attendance.create({ data: { userId, date: date ? new Date(date) : new Date(), status: status || 'Present' } })
    res.json(item)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

module.exports = router
