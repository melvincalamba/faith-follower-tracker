const express  = require('express')
const cors     = require('cors')
require('dotenv').config()

const membersRouter = require('./routes/members')
const authRouter    = require('./routes/auth')
const mentorsRouter = require('./routes/mentors')

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth',    authRouter)
app.use('/api/members', membersRouter)
app.use('/api/mentors', mentorsRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '🙏 FFT Backend is running!' })
})

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` })
})

// ← IMPORTANTENG PAGBABAGO: hindi na auto-listen
// I-listen lang kung hindi test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

module.exports = app