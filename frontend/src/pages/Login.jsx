import { useState }            from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../context/AuthContext'
import { loginUser }           from '../services/api'
import { validateLoginForm }   from '../utils/validation'
import FormField               from '../components/FormField'

function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }))
    }
  }

  const handleLogin = async () => {
    const { errors: ve, isValid } = validateLoginForm(form)
    if (!isValid) { setErrors(ve); return }
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-100 via-warm-50 to-primary-50
                    flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20
                          bg-white rounded-2xl shadow-warm mb-4 text-4xl">
            🙏
          </div>
          <h1 className="text-2xl font-bold text-warm-900">Faith Follower Tracker</h1>
          <p className="text-warm-500 text-sm mt-1">
            Discipleship progress tracking system
          </p>
        </div>

        {/* Login Card */}
        <div className="card shadow-warm">
          <h2 className="text-lg font-semibold text-warm-800 mb-6">Sign in to continue</h2>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700
                            rounded-xl px-4 py-3 text-sm mb-4 flex items-center gap-2">
              ⚠️ {errors.general}
            </div>
          )}

          <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
            <FormField label="Email" required error={errors.email}>
              <input
                name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="you@email.com"
                className={`input-field ${errors.email ? 'input-error' : ''}`}
              />
            </FormField>

            <FormField label="Password" required error={errors.password}>
              <input
                name="password" type="password"
                value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className={`input-field ${errors.password ? 'input-error' : ''}`}
              />
            </FormField>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`btn-primary w-full mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? '⏳ Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>

        <p className="text-center text-warm-400 text-xs mt-6">
          Faith Follower Tracker © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

export default Login