const pool = require('../config/db')

// Helper para sa cleaner error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

const validateMemberData = (data) => {
  const { name, progress, classification } = data
  const errors = []

  if (!name?.trim())
    errors.push('Name is required.')
  if (name?.trim().length > 100)
    errors.push('Name must not exceed 100 characters.')

  const validStages = ['Pre-FIC', 'FIC1', 'FIC2', 'Pre-CellDev', 'CellDev']
  if (progress && !validStages.includes(progress))
    errors.push('Invalid progress stage.')

  const validClassifications = [
    'Grade School', 'Junior High', 'Senior High',
    'Undergrad', 'Professional', 'TBA'
  ]
  if (classification && !validClassifications.includes(classification))
    errors.push('Invalid classification.')

  return errors
}

// GET /api/members
const getAllMembers = asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT
      m.id,
      m.name,
      m.details,
      m.mentor_id,
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
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params

    // ← I-validate muna kung valid number ang id
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid member ID.' })
    }

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

    // ← Direktang mag-return ng 404 — hindi mag-throw ng error
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found.' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('getMemberById error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

const getMemberHistory = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(`
      SELECT
        ph.id,
        ph.from_stage,
        ph.to_stage,
        ph.notes,
        ph.changed_at,
        u.name AS changed_by
      FROM progress_history ph
      LEFT JOIN users u ON ph.changed_by = u.id
      WHERE ph.member_id = $1
      ORDER BY ph.changed_at DESC
    `, [id])
    res.json(result.rows)
  } catch (err) {
    console.error('getMemberHistory error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// POST /api/members
const createMember = async (req, res) => {
  try {
    const { name, progress, classification, details } = req.body

    // ← Validation
    const validationErrors = validateMemberData(req.body)
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors.join(' ') })
    }

    const stageResult = await pool.query(
      'SELECT id FROM progress_stages WHERE label = $1', [progress]
    )
    const progress_stage_id = stageResult.rows[0]?.id || null

    const classResult = await pool.query(
      'SELECT id FROM classifications WHERE label = $1', [classification]
    )
    const classification_id = classResult.rows[0]?.id || null

    const mentor_id = req.user.id

    const result = await pool.query(`
      INSERT INTO members
        (name, progress_stage_id, classification_id, mentor_id, details)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [name, progress_stage_id, classification_id, mentor_id, details || null])

    res.status(201).json({
      message: 'Member created successfully!',
      id:      result.rows[0].id,
    })
  } catch (err) {
    console.error('createMember error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

// PUT /api/members/:id
const updateMember = async (req, res) => {
  try {
    const { id }    = req.params
    const { name, progress, classification, details } = req.body

    const current = await pool.query(`
      SELECT
        m.mentor_id,
        ps.label AS progress
      FROM members m
      LEFT JOIN progress_stages ps ON m.progress_stage_id = ps.id
      WHERE m.id = $1
    `, [id])

    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found.' })
    }

    if (req.user.role === 'mentor' &&
        current.rows[0].mentor_id !== req.user.id) {
      return res.status(403).json({
        error: 'Hindi ka pwedeng mag-edit ng follow-up na hindi mo assigned.'
      })
    }

    const oldProgress = current.rows[0].progress

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
        details           = $4,
        updated_at        = NOW()
      WHERE id = $5
    `, [name, progress_stage_id, classification_id, details || null, id])

    if (oldProgress !== progress) {
      await pool.query(`
        INSERT INTO progress_history
          (member_id, from_stage, to_stage, changed_by)
        VALUES ($1, $2, $3, $4)
      `, [id, oldProgress, progress, req.user.id])
    }

    res.json({ message: 'Member updated successfully!' })
  } catch (err) {
    console.error('updateMember error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

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
  getMemberHistory,
}