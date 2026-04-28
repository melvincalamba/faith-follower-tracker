import { useState }    from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../context/AuthContext'
import { loginUser }   from '../services/api'
import { validateLoginForm } from '../utils/validation'
import FormField             from '../components/FormField'

function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()
  const [errors, setErrors]   = useState({})


  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }))
    }
  }

  async function handleLogin() {
    const { errors: validationErrors, isValid } = validateLoginForm(form)
    if (!isValid) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.token, res.data.user)
      setTimeout(() => navigate('/'), 100)
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'May error sa login.' })
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

        {errors.general && (
          <p style={{ color: '#e74c3c', fontSize: '13px', margin: '0 0 12px' }}>
            ⚠️ {errors.general}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <FormField label="Email" required error={errors.email}>
            <input
              name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="you@email.com"
              style={inputStyle(errors.email)}
            />
          </FormField>
          <FormField label="Password" required error={errors.password}>
            <input
              name="password" type="password"
              value={form.password} onChange={handleChange}
              placeholder="••••••••"
              style={inputStyle(errors.password)}
            />
          </FormField>
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

const labelStyle = {
  display: 'flex', flexDirection: 'column',
  gap: '4px', fontSize: '14px', fontWeight: '600'
}
const inputStyle = (error) => ({
  padding: '8px 10px', border: error ? '1px solid #e74c3c' : '1px solid #ccc',
  borderRadius: '6px', fontSize: '14px',
})
const btnPrimary = {
  padding: '10px', backgroundColor: '#1e3a5f',
  color: 'white', border: 'none',
  borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
}

export default Login