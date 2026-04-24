import { useState, useEffect }  from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast                    from 'react-hot-toast'
import { getMember, deleteMember } from '../services/api'
import { useAuth }              from '../context/AuthContext'
import LoadingSpinner           from '../components/LoadingSpinner'
import ErrorMessage             from '../components/ErrorMessage'
import ProgressBadge            from '../components/ProgressBadge'

function MemberDetail() {
  const { id }                    = useParams()
  const navigate                  = useNavigate()
  const { user }                  = useAuth()
  const [member,  setMember]      = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error,   setError]       = useState(null)
  const [deleting,setDeleting]    = useState(false)

  const fetchMember = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getMember(id)
      setMember(res.data)
    } catch (err) {
      setError('Hindi ma-load ang member. Subukan ulit.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMember() }, [id])

  const handleDelete = async () => {
    if (!window.confirm(`I-delete si ${member.name}?`)) return
    setDeleting(true)
    try {
      await deleteMember(id)
      toast.success(`${member.name} ay na-delete na!`)
      navigate('/members')
    } catch (err) {
      toast.error('Hindi ma-delete. Subukan ulit.')
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Kinukuha ang member details..." />
  if (error)   return <ErrorMessage  message={error} onRetry={fetchMember} />

  return (
    <div style={{ padding: '24px', maxWidth: '600px' }}>

      {/* Back Button */}
      <Link to="/members" style={backLink}>← Back to Members</Link>

      {/* Header */}
      <div style={{
        display:         'flex',
        justifyContent:  'space-between',
        alignItems:      'flex-start',
        marginTop:       '16px',
        marginBottom:    '24px',
      }}>
        <div>
          <h2 style={{ margin: 0 }}>{member.name}</h2>
          <div style={{ marginTop: '8px' }}>
            <ProgressBadge progress={member.progress} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/members/${id}/edit`} style={editBtn}>
            ✏️ Edit
          </Link>
          {user?.role === 'admin' && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={deleteBtn}
            >
              {deleting ? 'Deleting...' : '🗑️ Delete'}
            </button>
          )}
        </div>
      </div>

      {/* Detail Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <DetailRow label="👤 Mentor"         value={member.mentor         || '—'} />
        <DetailRow label="🎓 Classification" value={member.classification || '—'} />
        <DetailRow label="📅 Date Added"     value={new Date(member.created_at).toLocaleDateString('en-PH', {
          year: 'numeric', month: 'long', day: 'numeric'
        })} />
        <DetailRow label="🔄 Last Updated"   value={new Date(member.updated_at).toLocaleDateString('en-PH', {
          year: 'numeric', month: 'long', day: 'numeric'
        })} />

        {/* Details / Notes */}
        <div style={detailCard}>
          <p style={{ margin: '0 0 6px', fontWeight: '600', color: '#555', fontSize: '13px' }}>
            📝 Details / Notes
          </p>
          <p style={{ margin: 0, color: '#333', lineHeight: '1.6' }}>
            {member.details || 'Walang details na naka-record.'}
          </p>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div style={detailCard}>
      <span style={{ fontWeight: '600', color: '#555', fontSize: '13px' }}>{label}</span>
      <span style={{ color: '#333', fontSize: '15px' }}>{value}</span>
    </div>
  )
}

const detailCard = {
  display:         'flex',
  flexDirection:   'column',
  gap:             '4px',
  padding:         '14px 16px',
  backgroundColor: '#f8f9ff',
  borderRadius:    '8px',
  border:          '1px solid #e8ecff',
}
const backLink  = { color: '#1e3a5f', textDecoration: 'none', fontSize: '14px' }
const editBtn   = {
  padding: '8px 16px', backgroundColor: '#2980b9',
  color: 'white', borderRadius: '6px',
  textDecoration: 'none', fontSize: '14px',
}
const deleteBtn = {
  padding: '8px 16px', backgroundColor: '#e74c3c',
  color: 'white', border: 'none',
  borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
}

export default MemberDetail