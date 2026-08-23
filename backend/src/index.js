require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const membershipsRoutes = require('./routes/memberships')
const paymentsRoutes = require('./routes/payments')
const attendanceRoutes = require('./routes/attendance')
const workoutsRoutes = require('./routes/workouts')
const { requireAuth } = require('./middleware/auth')

const app = express()

// Basic security headers
app.use(helmet())
app.use(cors())
app.use(express.json())

// Simple rate limiter for all API routes
const apiLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 120, // limit each IP to 120 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
})
app.use('/api', apiLimiter)

// Enforce a non-default JWT secret
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change-this-secret') {
	console.error('FATAL: please set a secure JWT_SECRET in backend/.env (do not use the default)')
	process.exit(1)
}

// Public auth routes
app.use('/api/auth', authRoutes)

// Protect subsequent API routes
app.use('/api', requireAuth)

app.use('/api/users', usersRoutes)
app.use('/api/memberships', membershipsRoutes)
app.use('/api/payments', paymentsRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/workouts', workoutsRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
