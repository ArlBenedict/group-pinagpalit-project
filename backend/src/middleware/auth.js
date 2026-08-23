const jwt = require('jsonwebtoken')
const prisma = require('../db')

const JWT_SECRET = process.env.JWT_SECRET || ''

function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing authorization' })
  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    return next()
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' })
  }
}

module.exports = { requireAuth }
