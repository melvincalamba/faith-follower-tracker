const request = require('supertest')
const app     = require('../app')
const pool    = require('../config/db')

let authToken = ''
let createdId = null

beforeAll(async () => {
  // Siguraduhing nag-eexist ang admin user
  // Kung hindi pa nag-eexist, gumawa ng isa
  try {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@fft.com', password: 'Admin1234' })

    if (loginRes.statusCode === 200) {
      authToken = loginRes.body.token
    } else {
      // Gumawa ng admin kung wala pa
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name:     'Admin User',
          email:    'admin@fft.com',
          password: 'Admin1234',
          role:     'admin',
        })
      authToken = registerRes.body.token
    }
  } catch (err) {
    console.error('Setup error:', err.message)
  }
})

afterAll(async () => {
  // I-cleanup ang test data
  if (createdId) {
    await pool.query('DELETE FROM members WHERE id = $1', [createdId])
  }
  await pool.end()
})

describe('Members Routes', () => {

  describe('GET /api/members', () => {

    it('dapat ibalik ang list ng members', async () => {
      const res = await request(app)
        .get('/api/members')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })

    it('dapat mag-fail kung walang token', async () => {
      const res = await request(app).get('/api/members')
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /api/members', () => {

    it('dapat mag-create ng bagong member', async () => {
      const res = await request(app)
        .post('/api/members')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name:           'Test Member QA',
          progress:       'Pre-FIC',
          classification: 'Undergrad',
          details:        'QA test member',
        })

      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.message).toMatch(/successfully/)
      createdId = res.body.id
    })

    it('dapat mag-fail kung walang name', async () => {
      const res = await request(app)
        .post('/api/members')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ progress: 'FIC1', classification: 'Undergrad' })

      expect(res.statusCode).toBe(400)
    })

    it('dapat mag-fail kung invalid ang progress stage', async () => {
      const res = await request(app)
        .post('/api/members')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test', progress: 'InvalidStage', classification: 'Undergrad' })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/members/:id', () => {

    it('dapat ibalik ang member by ID', async () => {
      const res = await request(app)
        .get(`/api/members/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe('Test Member QA')
    })

    it('dapat mag-return 404 kung hindi existing ang ID', async () => {
      const res = await request(app)
        .get('/api/members/999999')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.statusCode).toBe(404)
    })
  })

  describe('PUT /api/members/:id', () => {

    it('dapat mag-update ng member', async () => {
      const res = await request(app)
        .put(`/api/members/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name:           'Updated QA Member',
          progress:       'FIC1',
          classification: 'Professional',
          details:        'Updated details',
        })

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toMatch(/successfully/)
    })

    it('dapat mag-track ng progress change sa history', async () => {
      const res = await request(app)
        .get(`/api/members/${createdId}/history`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBeGreaterThan(0)
      expect(res.body[0].to_stage).toBe('FIC1')
    })
  })

  describe('DELETE /api/members/:id', () => {

    it('dapat mag-delete ng member', async () => {
      const res = await request(app)
        .delete(`/api/members/${createdId}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toMatch(/successfully/)
    })

    it('dapat ma-confirm na na-delete na ang member', async () => {
      // ← Gamitin ang createdId — siguradong wala na sa DB
      const deletedId = createdId
      createdId = null  // I-clear para hindi ulit i-delete sa afterAll

      const res = await request(app)
        .get(`/api/members/${deletedId}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.statusCode).toBe(404)
    })
  })
})