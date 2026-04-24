const pool = require('../config/db')

// Helper para sa cleaner error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// GET /api/members
const getAllMembers = asyncHandler(async (req, res) => {
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
    ORDER BY m.created_at DESC
  `)
  res.json(result.rows)
})

// GET /api/members/:id
const getMemberById = asyncHandler(async (req, res) => {
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
    WHERE m.id = $1
  `, [id])

  if (result.rows.length === 0) {
    res.status(404)
    throw new Error('Member not found.')
  }
  res.json(result.rows[0])
})

// POST /api/members
const createMember = asyncHandler(async (req, res) => {
  const { name, progress, classification, mentor_id, details } = req.body

  if (!name?.trim()) {
    res.status(400)
    throw new Error('Name is required.')
  }

  const stageResult = await pool.query(
    'SELECT id FROM progress_stages WHERE label = $1', [progress]
  )
  const progress_stage_id = stageResult.rows[0]?.id || null

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
})

// PUT /api/members/:id
const updateMember = asyncHandler(async (req, res) => {
  const { id }   = req.params
  const { name, progress, classification, mentor_id, details } = req.body

  if (!name?.trim()) {
    res.status(400)
    throw new Error('Name is required.')
  }

  const stageResult = await pool.query(
    'SELECT id FROM progress_stages WHERE label = $1', [progress]
  )
  const progress_stage_id = stageResult.rows[0]?.id || null

  const classResult = await pool.query(
    'SELECT id FROM classifications WHERE label = $1', [classification]
  )
  const classification_id = classResult.rows[0]?.id || null

  const result = await pool.query(
    'SELECT id FROM members WHERE id = $1', [id]
  )
  if (result.rows.length === 0) {
    res.status(404)
    throw new Error('Member not found.')
  }

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
})

// DELETE /api/members/:id
const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params

  const result = await pool.query(
    'SELECT id FROM members WHERE id = $1', [id]
  )
  if (result.rows.length === 0) {
    res.status(404)
    throw new Error('Member not found.')
  }

  await pool.query('DELETE FROM members WHERE id = $1', [id])
  res.json({ message: 'Member deleted successfully!' })
})

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
}