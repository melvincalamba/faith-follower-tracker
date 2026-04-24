const pool = require('../config/db')

// GET /api/members — kuhanin lahat ng members
const getAllMembers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.id,
        m.name,
        m.details,
        m.created_at,
        m.updated_at,
        ps.label  AS progress,
        c.label   AS classification,
        u.name    AS mentor
      FROM members m
      LEFT JOIN progress_stages ps ON m.progress_stage_id  = ps.id
      LEFT JOIN classifications  c  ON m.classification_id  = c.id
      LEFT JOIN users            u  ON m.mentor_id          = u.id
      ORDER BY m.created_at DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('getAllMembers error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// GET /api/members/:id — kuhanin ang isang member
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT
        m.id,
        m.name,
        m.details,
        m.created_at,
        m.updated_at,
        ps.label  AS progress,
        c.label   AS classification,
        u.name    AS mentor
      FROM members m
      LEFT JOIN progress_stages ps ON m.progress_stage_id  = ps.id
      LEFT JOIN classifications  c  ON m.classification_id  = c.id
      LEFT JOIN users            u  ON m.mentor_id          = u.id
      WHERE m.id = $1
    `, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('getMemberById error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/members — mag-add ng bagong member
const createMember = async (req, res) => {
  try {
    const { name, progress, classification, mentor_id, details } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    // Hanapin ang progress_stage_id
    const stageResult = await pool.query(
      'SELECT id FROM progress_stages WHERE label = $1', [progress]
    )
    const progress_stage_id = stageResult.rows[0]?.id || null

    // Hanapin ang classification_id
    const classResult = await pool.query(
      'SELECT id FROM classifications WHERE label = $1', [classification]
    )
    const classification_id = classResult.rows[0]?.id || null

    const result = await pool.query(`
      INSERT INTO members (name, progress_stage_id, classification_id, mentor_id, details)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [name, progress_stage_id, classification_id, mentor_id || null, details || null])

    res.status(201).json({
      message: 'Member created successfully!',
      id: result.rows[0].id
    })
  } catch (err) {
    console.error('createMember error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// PUT /api/members/:id — i-update ang member
const updateMember = async (req, res) => {
  try {
    const { id } = req.params
    const { name, progress, classification, mentor_id, details } = req.body

    const stageResult = await pool.query(
      'SELECT id FROM progress_stages WHERE label = $1', [progress]
    )
    const progress_stage_id = stageResult.rows[0]?.id || null

    const classResult = await pool.query(
      'SELECT id FROM classifications WHERE label = $1', [classification]
    )
    const classification_id = classResult.rows[0]?.id || null

    await pool.query(`
      UPDATE members
      SET
        name              = $1,
        progress_stage_id = $2,
        classification_id = $3,
        mentor_id         = $4,
        details           = $5,
        updated_at        = NOW()
      WHERE id = $6
    `, [name, progress_stage_id, classification_id, mentor_id || null, details || null, id])

    res.json({ message: 'Member updated successfully!' })
  } catch (err) {
    console.error('updateMember error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// DELETE /api/members/:id — burahin ang member
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM members WHERE id = $1', [id])
    res.json({ message: 'Member deleted successfully!' })
  } catch (err) {
    console.error('deleteMember error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
}