import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { progressStages, classifications, mentors } from '../data/mockData'
import toast from 'react-hot-toast'

const emptyForm = {
  name:           '',
  progress:       'Pre-FIC',
  classification: 'TBA',
  mentor:         '',
  details:        '',
}

function AddMember() {
  const [form, setForm]       = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const navigate              = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Palitan ang handleSubmit
  async function handleSubmit() {
    if (!form.name.trim()) {
      toast.error('Pangalan ay kailangan!')
      return
    }
    try {
      await createMember(form)
      toast.success('Member na-add successfully! 🙏')
      setTimeout(() => navigate('/members'), 1500)
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'May error sa pag-add ng member.'
      )
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <h2>Add New Member</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        <Field label="Name *">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            style={input}
          />
        </Field>

        <Field label="Progress Stage">
          <select name="progress" value={form.progress} onChange={handleChange} style={input}>
            {progressStages.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="Classification">
          <select name="classification" value={form.classification} onChange={handleChange} style={input}>
            {classifications.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Mentor">
          <select name="mentor" value={form.mentor} onChange={handleChange} style={input}>
            <option value="">-- Pumili ng Mentor --</option>
            {mentors.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>

        <Field label="Details / Notes">
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="Life updates, notes..."
            style={{ ...input, height: '80px', resize: 'vertical' }}
          />
        </Field>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSubmit} style={btnPrimary}>Add Member</button>
          <button onClick={() => navigate('/members')} style={btnSecondary}>Cancel</button>
        </div>

      </div>
    </div>
  )
}

// Reusable Field wrapper — props in action!
function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
      <span style={{ fontWeight: '600', color: '#333' }}>{label}</span>
      {children}
    </label>
  )
}

const input = {
  padding: '8px 10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '14px',
  width: '100%',
}
const btnPrimary = {
  flex: 1, padding: '10px',
  backgroundColor: '#1e3a5f', color: 'white',
  border: 'none', borderRadius: '6px',
  cursor: 'pointer', fontSize: '14px',
}
const btnSecondary = {
  flex: 1, padding: '10px',
  backgroundColor: '#eee', color: '#333',
  border: 'none', borderRadius: '6px',
  cursor: 'pointer', fontSize: '14px',
}

export default AddMember