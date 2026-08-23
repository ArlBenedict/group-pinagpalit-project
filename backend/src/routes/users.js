const express = require('express')
const router = express.Router()
const prisma = require('../db')

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, phone: true } })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, phone: true } })
  if (!user) return res.status(404).json({ error: 'not found' })
  res.json(user)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const data = req.body
  delete data.password
  try {
    const user = await prisma.user.update({ where: { id }, data })
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await prisma.user.delete({ where: { id } })
  res.json({ ok: true })
})

module.exports = router
