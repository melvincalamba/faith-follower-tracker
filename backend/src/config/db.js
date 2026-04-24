const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
})

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message)
    return
  }
  release()
  console.log('✅ Connected to PostgreSQL database!')
})

module.exports = pool