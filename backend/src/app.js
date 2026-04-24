const express  = require('express')
const cors     = require('cors')
require('dotenv').config()

const membersRouter = require('./routes/members')
const authRouter    = require('./routes/auth')
const { notFound, errorHandler } = require('./middleware/errorMiddleware') // ← BAGO

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Routes
app.use('/api/auth',    authRouter)
app.use('/api/members', membersRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '🙏 FFT Backend is running!' })
})

// ─── Error Handling — laging nasa pinakababa ──────────────
app.use(notFound)
app.use(errorHandler)

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})

// ─── 404 Handler (unknown routes) ────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})