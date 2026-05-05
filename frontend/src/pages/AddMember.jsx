import { useState }              from 'react'
import { useNavigate, Link }     from 'react-router-dom'
import toast                     from 'react-hot-toast'
import { createMember }          from '../services/api'
import { progressStages, classifications } from '../data/mockData'
import { validateMemberForm }    from '../utils/validation'
import FormField                 from '../components/FormField'
import { useAuth }               from '../context/AuthContext'

const emptyForm = {
  name:           '',
  progress:       'Pre-FIC',
  classification: 'TBA',
  details:        '',
}

function AddMember() {
  const [form,   setForm]   = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const navigate            = useNavigate()
  const { user }            = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleSubmit = async () => {
    const { errors: validationErrors, isValid } = validateMemberForm(form)
    if (!isValid) {
      setErrors(validationErrors)
      toast.error('Pakitama ang mga error bago mag-submit.')
      return
    }
    setSaving(true)
    try {
      await createMember(form)
      toast.success('Follow-up member na-add successfully! 🙏')
      setTimeout(() => navigate('/members'), 1500)
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'May error sa pag-add. Subukan ulit.'
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
          to="/members"
          className="text-primary-600 hover:text-primary-700
                     text-sm font-medium no-underline"
        >
          ← Back to Members
        </Link>
        <h1 className="page-title mt-4">Add New Follow-up Member</h1>

        {/* Info — kung sino ang magiging mentor */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700
                        rounded-xl px-4 py-3 text-sm mt-3 inline-flex
                        items-center gap-2">
          👤 Ikaw ang magiging mentor ng member na ito:
          <strong>{user?.name}</strong>
        </div>
      </div>

      {/* Form */}
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

          <FormField label="Progress Stage" required error={errors.progress}>
            <select
              name="progress"
              value={form.progress}
              onChange={handleChange}
              className={`input-field ${errors.progress ? 'input-error' : ''}`}
            >
              {progressStages.map(s => <option key={s}>{s}</option>)}
            </select>
          </FormField>

          <FormField label="Classification" required error={errors.classification}>
            <select
              name="classification"
              value={form.classification}
              onChange={handleChange}
              className={`input-field ${errors.classification ? 'input-error' : ''}`}
            >
              {classifications.map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>

          <FormField
            label="Details / Notes"
            error={errors.details}
            hint={`${form.details.length}/500 characters`}
          >
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              placeholder="Life updates, notes..."
              maxLength={500}
              className={`input-field h-24 resize-none
                          ${errors.details ? 'input-error' : ''}`}
            />
          </FormField>

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`btn-primary flex-1
                          ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? '⏳ Saving...' : '✅ Add Member'}
            </button>
            <button
              onClick={() => navigate('/members')}
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

export default AddMember