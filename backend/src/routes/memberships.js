const express = require('express')
const router = express.Router()
const prisma = require('../db')

router.get('/', async (req, res) => {
  const items = await prisma.membership.findMany({ include: { user: { select: { id: true, name: true, email: true } } } })
  res.json(items)
})

router.post('/', async (req, res) => {
  const data = req.body
  try {
    const created = await prisma.membership.create({ data: { userId: data.userId, plan: data.plan, status: data.status || 'Active', startDate: new Date(data.startDate), endDate: new Date(data.endDate), price: data.price || 0, benefits: data.benefits || [] } })
    res.json(created)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const data = req.body
  try {
    const updated = await prisma.membership.update({ where: { id }, data: { plan: data.plan, status: data.status, startDate: data.startDate ? new Date(data.startDate) : undefined, endDate: data.endDate ? new Date(data.endDate) : undefined, price: data.price, benefits: data.benefits } })
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await prisma.membership.delete({ where: { id } })
  res.json({ ok: true })
})

module.exports = router
