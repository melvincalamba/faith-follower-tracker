const pool    = require('../config/db')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
require('dotenv').config()

// ─── REGISTER ─────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Name, email, at password ay kailangan.' })
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Name ay dapat hindi bababa sa 2 characters.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Hindi valid na email format.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password ay dapat hindi bababa sa 6 characters.' })
    }

    // Check existing
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email ay already in use.' })
    }

    const salt           = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // ← Default role: mentor, default status: pending
    await pool.query(`
      INSERT INTO users (name, email, password, role, status)
      VALUES ($1, $2, $3, 'mentor', 'pending')
    `, [name.trim(), email.trim(), hashedPassword])

    // ← Hindi agad makakapag-login, kailangan ng admin approval
    res.status(201).json({
      message: 'Successfully registered! Hintayin ang approval ng Admin bago makakapag-login.',
    })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// ─── LOGIN ────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email at password ay kailangan.' })
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Mali ang email o password.' })
    }

    const user = result.rows[0]

    // ← Check if account is pending approval
    if (user.status === 'pending') {
      return res.status(403).json({
        error: 'Ang iyong account ay pending pa. Hintayin ang approval ng Admin.'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Mali ang email o password.' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      }
    })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// ─── GET CURRENT USER ────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error('getMe error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { register, login, getMe }