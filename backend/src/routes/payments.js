const express = require('express')
const router = express.Router()
const prisma = require('../db')

router.get('/', async (req, res) => {
  const items = await prisma.payment.findMany({ include: { user: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' } })
  res.json(items)
})

router.post('/', async (req, res) => {
  const { userId, amount, plan, status } = req.body
  try {
    const payment = await prisma.payment.create({ data: { userId, amount: amount || 0, plan: plan || '', status: status || 'Pending' } })
    res.json(payment)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.put('/:id/approve', async (req, res) => {
  const { id } = req.params
  try {
    const payment = await prisma.payment.update({ where: { id }, data: { status: 'Paid' } })
    // create or update membership
    // naive: create membership if none
    const existing = await prisma.membership.findFirst({ where: { userId: payment.userId } })
    const planDetails = { title: payment.plan, durationMonths: 6, price: payment.amount }
    const start = new Date()
    const end = new Date(start)
    end.setMonth(end.getMonth() + planDetails.durationMonths)
    if (!existing) {
      await prisma.membership.create({ data: { userId: payment.userId, plan: planDetails.title, status: 'Active', startDate: start, endDate: end, price: planDetails.price, benefits: [] } })
    } else {
      await prisma.membership.update({ where: { id: existing.id }, data: { status: 'Active', plan: planDetails.title, startDate: start, endDate: end, price: planDetails.price } })
    }
    res.json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

module.exports = router
