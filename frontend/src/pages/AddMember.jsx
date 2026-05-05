import { useState, useEffect }          from 'react'
import { useNavigate }                  from 'react-router-dom'
import toast                            from 'react-hot-toast'
import { createMember, getMentors }     from '../services/api'
import { progressStages, classifications } from '../data/mockData'
import { validateMemberForm }           from '../utils/validation'
import FormField                        from '../components/FormField'

const emptyForm = {
  name:           '',
  progress:       'Pre-FIC',
  classification: 'TBA',
  mentor_id:      '',
  details:        '',
}

function AddMember() {
  const [form,    setForm]    = useState(emptyForm)
  const [errors,  setErrors]  = useState({})
  const [mentors, setMentors] = useState([])
  const [saving,  setSaving]  = useState(false)
  const navigate              = useNavigate()

  useEffect(() => {
    getMentors()
      .then(res => setMentors(res.data))
      .catch(()  => toast.error('Hindi ma-load ang mentors.'))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // I-clear ang error ng field na binago
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
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
      toast.success('Member na-add successfully! 🙏')
      setTimeout(() => navigate('/members'), 1500)
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'May error sa pag-add ng member.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <h2>Add New Member</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <FormField label="Name" required error={errors.name}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            style={inputStyle(errors.name)}
          />
        </FormField>

        <FormField label="Progress Stage" required error={errors.progress}>
          <select name="progress" value={form.progress} onChange={handleChange} style={inputStyle(errors.progress)}>
            {progressStages.map(s => <option key={s}>{s}</option>)}
          </select>
        </FormField>

        <FormField label="Classification" required error={errors.classification}>
          <select name="classification" value={form.classification} onChange={handleChange} style={inputStyle(errors.classification)}>
            {classifications.map(c => <option key={c}>{c}</option>)}
          </select>
        </FormField>

        <FormField label="Mentor">
          <select name="mentor_id" value={form.mentor_id} onChange={handleChange} style={inputStyle()}>
            <option value="">-- Pumili ng Mentor --</option>
            {mentors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
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
            style={{ ...inputStyle(errors.details), height: '80px', resize: 'vertical' }}
          />
        </FormField>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving...' : 'Add Member'}
          </button>
          <button onClick={() => navigate('/members')} style={btnSecondary}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}

// Dynamic border color based sa error
const inputStyle = (error) => ({
  padding:      '8px 10px',
  border:       `1px solid ${error ? '#e74c3c' : '#ccc'}`,
  borderRadius: '6px',
  fontSize:     '14px',
  width:        '100%',
  outline:      error ? '2px solid #fde8e8' : 'none',
})

const btnPrimary   = { flex: 1, padding: '10px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }
const btnSecondary = { flex: 1, padding: '10px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }

export default AddMember