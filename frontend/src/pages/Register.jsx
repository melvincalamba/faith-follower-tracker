import { useState }         from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast                from 'react-hot-toast'
import { registerUser }     from '../services/api'
import FormField            from '../components/FormField'

const emptyForm = {
  name:     '',
  email:    '',
  password: '',
  confirm:  '',
}

function Register() {
  const [form,      setForm]      = useState(emptyForm)
  const [errors,    setErrors]    = useState({})
  const [saving,    setSaving]    = useState(false)
  const [success,   setSuccess]   = useState(false)
  const navigate                  = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())
      errs.name = 'Pangalan ay kailangan.'
    else if (form.name.trim().length < 2)
      errs.name = 'Pangalan ay dapat hindi bababa sa 2 characters.'
    if (!form.email.trim())
      errs.email = 'Email ay kailangan.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Hindi valid na email format.'
    if (!form.password)
      errs.password = 'Password ay kailangan.'
    else if (form.password.length < 6)
      errs.password = 'Password ay dapat hindi bababa sa 6 characters.'
    if (!form.confirm)
      errs.confirm = 'Kailangan i-confirm ang password.'
    else if (form.password !== form.confirm)
      errs.confirm = 'Hindi magkatugma ang passwords.'
    return errs
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast.error('Pakitama ang mga error bago mag-submit.')
      return
    }
    setSaving(true)
    try {
      await registerUser({
        name:     form.name,
        email:    form.email,
        password: form.password,
      })
      setSuccess(true)
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'May error sa pag-register. Subukan ulit.'
      )
    } finally {
      setSaving(false)
    }
  }

  // ─── Success State ────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-100 via-warm-50
                      to-primary-50 flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center shadow-warm">
          <span className="text-6xl">🙏</span>
          <h2 className="text-xl font-bold text-warm-900 mt-4">
            Registration Successful!
          </h2>
          <p className="text-warm-500 text-sm mt-2 mb-6">
            Ang iyong account ay <strong>pending approval</strong> pa.
            Hintayin ang Admin na mag-approve ng iyong account
            bago ka makakapag-login.
          </p>
          <Link to="/login" className="btn-primary no-underline inline-block">
            Bumalik sa Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-100 via-warm-50
                    to-primary-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20
                          bg-white rounded-2xl shadow-warm mb-4 text-4xl">
            🙏
          </div>
          <h1 className="text-2xl font-bold text-warm-900">
            Faith Follower Tracker
          </h1>
          <p className="text-warm-500 text-sm mt-1">
            Gumawa ng bagong account
          </p>
        </div>

        {/* Form Card */}
        <div className="card shadow-warm">
          <h2 className="text-lg font-semibold text-warm-800 mb-2">
            Create Account
          </h2>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700
                          rounded-xl px-4 py-3 text-sm mb-4">
            ℹ️ Ang bagong account ay kailangan munang
            <strong> i-approve ng Admin </strong>
            bago makakapag-login.
          </div>

          <div className="flex flex-col gap-4">
            <FormField label="Full Name" required error={errors.name}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Juan dela Cruz"
                className={`input-field ${errors.name ? 'input-error' : ''}`}
              />
            </FormField>

            <FormField label="Email" required error={errors.email}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className={`input-field ${errors.email ? 'input-error' : ''}`}
              />
            </FormField>

            <FormField
              label="Password" required error={errors.password}
              hint="Minimum 6 characters"
            >
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input-field ${errors.password ? 'input-error' : ''}`}
              />
            </FormField>

            <FormField label="Confirm Password" required error={errors.confirm}>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input-field ${errors.confirm ? 'input-error' : ''}`}
              />
            </FormField>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`btn-primary w-full mt-2
                          ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? '⏳ Registering...' : 'Create Account'}
            </button>

            <p className="text-center text-warm-500 text-sm">
              May account ka na?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium no-underline"
              >
                Sign in dito
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register