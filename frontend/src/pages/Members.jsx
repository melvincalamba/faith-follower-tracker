import { useState, useEffect }        from 'react'
import { Link }                       from 'react-router-dom'
import toast                          from 'react-hot-toast'
import { getMembers, deleteMember }   from '../services/api'
import { progressStages }             from '../data/mockData'
import { useAuth }                    from '../context/AuthContext'
import LoadingSpinner                 from '../components/LoadingSpinner'
import ErrorMessage                   from '../components/ErrorMessage'
import EmptyState                     from '../components/EmptyState'
import ProgressBadge                  from '../components/ProgressBadge'
import { useNavigate }                from 'react-router-dom'

function Members() {
  const navigate =  useNavigate()
  const [members,     setMembers]   = useState([])
  const [loading,     setLoading]   = useState(true)
  const [error,       setError]     = useState(null)
  const [search,      setSearch]    = useState('')
  const [filterStage, setFilter]    = useState('All')
  const [deleting,    setDeleting]  = useState(null)
  const { user }                    = useAuth()

  const fetchMembers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getMembers()
      setMembers(res.data)
    } catch (err) {
      setError('Hindi ma-load ang mga members. Subukan ulit.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`I-delete si ${name}?`)) return
    setDeleting(id)
    try {
      await deleteMember(id)
      setMembers(prev => prev.filter(m => m.id !== id))
      toast.success(`${name} ay na-delete na!`)
    } catch (err) {
      toast.error('Hindi ma-delete ang member. Subukan ulit.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchStage  = filterStage === 'All' || m.progress === filterStage
    return matchSearch && matchStage
  })

  if (loading) return <LoadingSpinner message="Kinukuha ang mga members..." />
  if (error)   return <ErrorMessage  message={error} onRetry={fetchMembers} />

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Members ({filtered.length})</h2>
        <Link to="/add-member" style={addBtn}>+ Add Member</Link>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', margin: '16px 0' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={filterStage} onChange={e => setFilter(e.target.value)} style={inputStyle}>
          <option value="All">All Stages</option>
          {progressStages.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Walang Resulta"
          message={
            search || filterStage !== 'All'
              ? 'Walang members na nakakatugon sa iyong search/filter.'
              : 'Wala pang members. Mag-add na!'
          }
          action={
            (!search && filterStage === 'All') &&
            <Link to="/add-member" style={addBtn}>+ Add Member</Link>
          }
        />
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
              <th style={th}>Name</th>
              <th style={th}>Progress</th>
              <th style={th}>Mentor</th>
              <th style={th}>Classification</th>
              <th style={th}>Details</th>
              {user?.role === 'admin' && <th style={th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(member => (
              <tr
                key={member.id}
                onClick={() => navigate(`/members/${member.id}`)}
                style={{
                  borderBottom: '1px solid #ddd',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={td}>{member.name}</td>
                <td style={td}><ProgressBadge progress={member.progress} /></td>
                <td style={td}>{member.mentor         || '—'}</td>
                <td style={td}>{member.classification || '—'}</td>
                <td style={{ ...td, color: '#555', fontSize: '13px' }}>
                  {member.details || '—'}
                </td>
                {user?.role === 'admin' && (
                  <td style={td}>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      disabled={deleting === member.id}
                      style={deleteBtn}
                    >
                      {deleting === member.id ? '...' : 'Delete'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const th         = { padding: '10px 16px', textAlign: 'left' }
const td         = { padding: '10px 16px' }
const inputStyle = { padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }
const addBtn     = { padding: '8px 16px', backgroundColor: '#1e3a5f', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }
const deleteBtn  = { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }

export default Members