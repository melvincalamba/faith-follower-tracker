const pool = require('../config/db')

const getAllMentors = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, role
      FROM users
      WHERE role = 'mentor' OR role = 'admin'
      ORDER BY name ASC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('getAllMentors error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /api/mentors/:id/members — members assigned sa mentor
const getMentorMembers = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT
        m.id,
        m.name,
        m.details,
        m.created_at,
        m.updated_at,
        ps.label AS progress,
        c.label  AS classification,
        u.name   AS mentor
      FROM members m
      LEFT JOIN progress_stages ps ON m.progress_stage_id = ps.id
      LEFT JOIN classifications  c  ON m.classification_id = c.id
      LEFT JOIN users            u  ON m.mentor_id         = u.id
      WHERE m.mentor_id = $1
      ORDER BY m.created_at DESC
    `, [id])
    res.json(result.rows)
  } catch (err) {
    console.error('getMentorMembers error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { getAllMentors, getMentorMembers }