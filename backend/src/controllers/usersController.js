const pool = require('../config/db')

// GET /api/users — lahat ng users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, role, status, created_at
      FROM users
      ORDER BY
        CASE status
          WHEN 'pending' THEN 1
          WHEN 'active'  THEN 2
        END,
        created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('getAllUsers error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// PATCH /api/users/:id/approve — i-approve ang pending user
const approveUser = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'SELECT id, status FROM users WHERE id = $1', [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }
    if (result.rows[0].status === 'active') {
      return res.status(400).json({ error: 'User ay active na.' })
    }

    await pool.query(
      'UPDATE users SET status = $1 WHERE id = $2',
      ['active', id]
    )

    res.json({ message: 'User approved successfully!' })
  } catch (err) {
    console.error('approveUser error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// DELETE /api/users/:id — i-reject/delete ang pending user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    // Hindi pwedeng i-delete ang sarili
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Hindi mo pwedeng i-delete ang sarili mong account.' })
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id])
    res.json({ message: 'User deleted successfully!' })
  } catch (err) {
    console.error('deleteUser error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getAllUsers, approveUser, deleteUser }