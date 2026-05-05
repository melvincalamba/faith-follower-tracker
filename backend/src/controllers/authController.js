const pool    = require('../config/db')
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
require('dotenv').config()

// ─── REGISTER ────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // ← Mas mahigpit na validation
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

    // ← Valid roles lang
    const validRoles = ['admin', 'mentor']
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' })
    }

    // Check kung may existing na user
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email ay already in use.' })
    }

    const salt           = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const result = await pool.query(`
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
    `, [name.trim(), email.trim(), hashedPassword, role || 'mentor'])

    const newUser = result.rows[0]

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id:    newUser.id,
        name:  newUser.name,
        email: newUser.email,
        role:  newUser.role,
      }
    })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// ─── LOGIN ───────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email at password ay kailangan.' })
    }

    // Hanapin ang user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    )
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Mali ang email o password.' })
    }

    const user = result.rows[0]

    // I-compare ang password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Mali ang email o password.' })
    }

    // Gumawa ng JWT
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