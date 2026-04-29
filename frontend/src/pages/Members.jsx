import { useState, useEffect }       from 'react'
import { Link, useNavigate }         from 'react-router-dom'
import toast                         from 'react-hot-toast'
import { getMembers, deleteMember }  from '../services/api'
import { progressStages }            from '../data/mockData'
import { useAuth }                   from '../context/AuthContext'
import LoadingSpinner                from '../components/LoadingSpinner'
import ErrorMessage                  from '../components/ErrorMessage'
import EmptyState                    from '../components/EmptyState'
import ProgressBadge                 from '../components/ProgressBadge'

function Members() {
  const [members,    setMembers]  = useState([])
  const [loading,    setLoading]  = useState(true)
  const [error,      setError]    = useState(null)
  const [search,     setSearch]   = useState('')
  const [filter,     setFilter]   = useState('All')
  const [deleting,   setDeleting] = useState(null)
  const { user }                  = useAuth()
  const navigate                  = useNavigate()

  const fetchMembers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getMembers()
      setMembers(res.data)
    } catch {
      setError('Hindi ma-load ang mga members. Subukan ulit.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  const handleDelete = async (e, id, name) => {
    e.stopPropagation()
    if (!window.confirm(`I-delete si ${name}?`)) return
    setDeleting(id)
    try {
      await deleteMember(id)
      setMembers(prev => prev.filter(m => m.id !== id))
      toast.success(`${name} ay na-delete na!`)
    } catch {
      toast.error('Hindi ma-delete. Subukan ulit.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchStage  = filter === 'All' || m.progress === filter
    return matchSearch && matchStage
  })

  if (loading) return <LoadingSpinner message="Kinukuha ang mga members..." />
  if (error)   return <ErrorMessage  message={error} onRetry={fetchMembers} />

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="text-warm-500 text-sm mt-1">
            {filtered.length} member{filtered.length !== 1 ? 's' : ''} na nahanap
          </p>
        </div>
        <Link to="/add-member" className="btn-primary no-underline">
          + Add Member
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="card mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="All">All Stages</option>
            {progressStages.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon="🔍"
              title="Walang Resulta"
              message={
                search || filter !== 'All'
                  ? 'Walang members na nakakatugon sa iyong search.'
                  : 'Wala pang members. Mag-add na!'
              }
              action={
                !search && filter === 'All' &&
                <Link to="/add-member" className="btn-primary no-underline">
                  + Add Member
                </Link>
              }
            />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Progress</th>
                <th className="table-header">Mentor</th>
                <th className="table-header">Classification</th>
                <th className="table-header">Details</th>
                {user?.role === 'admin' && (
                  <th className="table-header text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr
                  key={member.id}
                  className="table-row"
                  onClick={() => navigate(`/members/${member.id}`)}
                >
                  <td className="table-cell font-semibold text-warm-900">
                    {member.name}
                  </td>
                  <td className="table-cell">
                    <ProgressBadge progress={member.progress} />
                  </td>
                  <td className="table-cell">{member.mentor         || '—'}</td>
                  <td className="table-cell">{member.classification || '—'}</td>
                  <td className="table-cell text-warm-500 max-w-xs truncate">
                    {member.details || '—'}
                  </td>
                  {user?.role === 'admin' && (
                    <td className="table-cell text-center">
                      <button
                        onClick={e => handleDelete(e, member.id, member.name)}
                        disabled={deleting === member.id}
                        className="btn-danger text-xs px-3 py-1.5"
                      >
                        {deleting === member.id ? '...' : '🗑️ Delete'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Members