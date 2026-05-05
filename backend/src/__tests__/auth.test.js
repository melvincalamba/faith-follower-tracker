const request = require('supertest')
const app     = require('../app')
const pool    = require('../config/db')

const testUser = {
  name:     'Test User',
  email:    `test_${Date.now()}@fft.com`,
  password: 'TestPass123',
  role:     'mentor',
}

let authToken = ''

// ← Isara ang DB connection pagkatapos ng lahat ng tests
afterAll(async () => {
  await pool.query(
    'DELETE FROM users WHERE email = $1', [testUser.email]
  )
  await pool.end()
})

describe('Auth Routes', () => {

  describe('POST /api/auth/register', () => {

    it('dapat mag-register ng bagong user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)

      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user.email).toBe(testUser.email)
      expect(res.body.user.role).toBe('mentor')
      authToken = res.body.token
    })

    it('dapat mag-fail kung duplicate ang email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)

      expect(res.statusCode).toBe(409)
      expect(res.body).toHaveProperty('error')
    })

    it('dapat mag-fail kung walang required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@fft.com' })

      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty('error')
    })
  })

  describe('POST /api/auth/login', () => {

    it('dapat mag-login ng existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })

      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('token')
    })

    it('dapat mag-fail kung mali ang password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'malinapassword' })

      expect(res.statusCode).toBe(401)
    })

    it('dapat mag-fail kung hindi existing ang email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wala@fft.com', password: 'TestPass123' })

      expect(res.statusCode).toBe(401)
    })
  })

  describe('GET /api/auth/me', () => {

    it('dapat ibalik ang current user kung may valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.email).toBe(testUser.email)
    })

    it('dapat mag-fail kung walang token', async () => {
      const res = await request(app).get('/api/auth/me')
      expect(res.statusCode).toBe(401)
    })

    it('dapat mag-fail kung invalid ang token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123')

      expect(res.statusCode).toBe(401)
    })
  })
})