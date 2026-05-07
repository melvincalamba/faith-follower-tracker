const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
})

// ← Retry logic — hintayin ang DB na maging ready
const connectWithRetry = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect()
      client.release()
      console.log('✅ Connected to PostgreSQL database!')
      return
    } catch (err) {
      console.log(`⏳ DB not ready yet... retrying (${i + 1}/${retries})`)
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay))
      } else {
        console.error('❌ Database connection error:', err.message)
      }
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  connectWithRetry()
}

module.exports = pool