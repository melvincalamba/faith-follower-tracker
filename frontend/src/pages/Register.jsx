import { useState, useEffect }  from 'react'
import { useNavigate, Link }    from 'react-router-dom'
import toast                    from 'react-hot-toast'
import { registerUser }         from '../services/api'
import { validateLoginForm }    from '../utils/validation'
import FormField                from '../components/FormField'

const emptyForm = {
  name:     '',
  email:    '',
  password: '',
  confirm:  '',
  role:     'mentor',
}

function Register() {
  const [form,    setForm]    = useState(emptyForm)
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)
  const navigate              = useNavigate()

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
        role:     form.role,
      })
      toast.success(`${form.role === 'admin' ? 'Admin' : 'Mentor'} na-register successfully! 🙏`)
      navigate('/mentor-dashboard')
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'May error sa pag-register. Subukan ulit.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <Link
          to="/mentor-dashboard"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium no-underline"
        >
          ← Back to Mentor Dashboard
        </Link>
        <h1 className="page-title mt-4">Register New User</h1>
        <p className="text-warm-500 text-sm mt-1">
          Mag-add ng bagong Mentor o Admin sa system.
        </p>
      </div>

      {/* Form Card */}
      <div className="card max-w-md">
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
              placeholder="mentor@fft.com"
              className={`input-field ${errors.email ? 'input-error' : ''}`}
            />
          </FormField>

          <FormField label="Password" required error={errors.password}
            hint="Minimum 6 characters">
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

          <FormField label="Role" required>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </FormField>

          {/* Role Info */}
          <div className={`rounded-xl px-4 py-3 text-sm ${
            form.role === 'admin'
              ? 'bg-orange-50 border border-orange-200 text-orange-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}>
            {form.role === 'admin' ? (
              <p className="m-0">
                ⚠️ <strong>Admin</strong> — makakakita ng lahat, makakapag-delete,
                at makakapag-register ng bagong users.
              </p>
            ) : (
              <p className="m-0">
                👤 <strong>Mentor</strong> — makakakita at makakapag-update
                ng assigned members niya lang.
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`btn-primary flex-1 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? '⏳ Registering...' : '✅ Register User'}
            </button>
            <button
              onClick={() => navigate('/mentor-dashboard')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register