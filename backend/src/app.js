const express  = require('express')
const cors     = require('cors')
require('dotenv').config()

const membersRouter = require('./routes/members')
const authRouter    = require('./routes/auth')      // ← BAGO

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Routes
app.use('/api/auth',    authRouter)                // ← BAGO
app.use('/api/members', membersRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '🙏 FFT Backend is running!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})