import { useState, useEffect }  from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast                    from 'react-hot-toast'
import { getMember, updateMember, getMentors } from '../services/api'
import { progressStages, classifications }     from '../data/mockData'
import LoadingSpinner           from '../components/LoadingSpinner'
import ErrorMessage             from '../components/ErrorMessage'

const emptyForm = {
  name:           '',
  progress:       'Pre-FIC',
  classification: 'TBA',
  mentor_id:      '',
  details:        '',
}

function EditMember() {
  const { id }                      = useParams()
  const navigate                    = useNavigate()
  const [form,    setForm]          = useState(emptyForm)
  const [mentors, setMentors]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [saving,  setSaving]        = useState(false)
  const [error,   setError]         = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [memberRes, mentorsRes] = await Promise.all([
          getMember(id),
          getMentors(),
        ])
        const m = memberRes.data
        // I-match ang mentor_id base sa name
        const mentor = mentorsRes.data.find(mn => mn.name === m.mentor)

        setForm({
          name:           m.name           || '',
          progress:       m.progress       || 'Pre-FIC',
          classification: m.classification || 'TBA',
          mentor_id:      mentor?.id       || '',
          details:        m.details        || '',
        })
        setMentors(mentorsRes.data)
      } catch (err) {
        setError('Hindi ma-load ang member. Subukan ulit.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Pangalan ay kailangan!')
      return
    }
    setSaving(true)
    try {
      await updateMember(id, form)
      toast.success('Member na-update successfully! 🙏')
      navigate(`/members/${id}`)
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'May error sa pag-update. Subukan ulit.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner message="Kinukuha ang member data..." />
  if (error)   return <ErrorMessage  message={error} />

  return (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <Link to={`/members/${id}`} style={backLink}>← Back to Member</Link>
      <h2 style={{ marginTop: '16px' }}>Edit Member</h2>

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
          <select name="mentor_id" value={form.mentor_id} onChange={handleChange} style={input}>
            <option value="">-- Pumili ng Mentor --</option>
            {mentors.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
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
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button
            onClick={() => navigate(`/members/${id}`)}
            style={btnSecondary}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px' }}>
      <span style={{ fontWeight: '600', color: '#333' }}>{label}</span>
      {children}
    </label>
  )
}

const input       = { padding: '8px 10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', width: '100%' }
const btnPrimary  = { flex: 1, padding: '10px', backgroundColor: '#1e3a5f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }
const btnSecondary= { flex: 1, padding: '10px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }
const backLink    = { color: '#1e3a5f', textDecoration: 'none', fontSize: '14px' }

export default EditMember