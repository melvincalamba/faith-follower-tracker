import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../context/AuthContext'
import { loginUser }   from '../services/api'

function Login() {
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login }         = useAuth()
  const navigate          = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleLogin() {
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'May error sa login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f4ff',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '360px',
      }}>
        <h2 style={{ textAlign: 'center', color: '#1e3a5f', marginBottom: '8px' }}>
          🙏 Faith Follower Tracker
        </h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '24px', fontSize: '14px' }}>
          Sign in to continue
        </p>

        {error && (
          <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={labelStyle}>Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@email.com"
              style={input}
            />
          </label>
          <label style={labelStyle}>Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={input}
            />
          </label>
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ ...btnPrimary, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', fontWeight: '600' }
const input      = { padding: '8px 10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }
const btnPrimary = { padding: '10px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }

export default Login