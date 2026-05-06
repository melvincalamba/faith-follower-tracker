import { useState }                     from 'react'
import { useNavigate }                  from 'react-router-dom'
import toast                            from 'react-hot-toast'
import { createMember }                 from '../services/api'
import { progressStages, classifications } from '../data/mockData'
import { validateMemberForm }           from '../utils/validation'
import FormField                        from '../components/FormField'

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleSubmit = async () => {
    const { errors: ve, isValid } = validateMemberForm(form)
    if (!isValid) {
      setErrors(ve)
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
      <div className="mb-6">
        <h1 className="page-title">Add Follow-up Member</h1>
        <p className="text-warm-500 text-sm mt-1">
          Ang bagong member ay awtomatikong magiging follow-up mo.
        </p>
      </div>

      <div className="card max-w-md">
        <div className="flex flex-col gap-4">

          <FormField label="Name" required error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
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
              className={`input-field ${errors.details ? 'input-error' : ''}`}
              style={{ height: '80px', resize: 'vertical' }}
            />
          </FormField>

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`btn-primary flex-1 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? '⏳ Saving...' : '+ Add Member'}
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