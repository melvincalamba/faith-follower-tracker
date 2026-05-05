import { useState, useEffect }  from 'react'
import { Link }                 from 'react-router-dom'
import { getMembers }           from '../services/api'
import { useAuth }              from '../context/AuthContext'
import LoadingSpinner           from '../components/LoadingSpinner'
import ErrorMessage             from '../components/ErrorMessage'
import EmptyState               from '../components/EmptyState'
import ProgressBadge            from '../components/ProgressBadge'

const statConfig = [
  { key: 'total',    label: 'Total Members',  icon: '👥', color: 'bg-warm-700'    },
  { key: 'preFIC',   label: 'Pre-FIC',        icon: '🌱', color: 'bg-orange-400'  },
  { key: 'progress', label: 'In Progress',    icon: '📖', color: 'bg-blue-500'    },
  { key: 'cellDev',  label: 'Cell Dev',       icon: '✝️', color: 'bg-accent-600'  },
]

function Dashboard() {
  const { user }              = useAuth()
  const [members,  setMembers] = useState([])
  const [loading,  setLoading] = useState(true)
  const [error,    setError]   = useState(null)

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

  const stats = {
    total:    members.length,
    preFIC:   members.filter(m => m.progress === 'Pre-FIC').length,
    progress: members.filter(m => ['FIC1','FIC2','Pre-CellDev'].includes(m.progress)).length,
    cellDev:  members.filter(m => m.progress === 'CellDev').length,
  }

  if (loading) return <LoadingSpinner message="Kinukuha ang mga members..." />
  if (error)   return <ErrorMessage  message={error} onRetry={fetchMembers} />

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">
            Magandang araw, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-warm-500 text-sm mt-1">
            Ito ang overview ng ating discipleship pipeline.
          </p>
        </div>
        <Link to="/add-member" className="btn-primary no-underline">
          + Add Member
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {statConfig.map(s => (
          <div key={s.key} className={`${s.color} rounded-2xl p-5 text-white shadow-card`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{s.icon}</span>
              <span className="text-4xl font-bold">{stats[s.key]}</span>
            </div>
            <p className="text-sm font-medium opacity-90 m-0">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Members */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title m-0">Recent Members</h2>
          <Link to="/members" className="text-primary-600 hover:text-primary-700 text-sm font-medium no-underline">
            View All →
          </Link>
        </div>

        {members.length === 0 ? (
          <EmptyState
            icon="👥"
            title="Wala pang Members"
            message="Mag-add ng unang member para magsimula."
            action={<Link to="/add-member" className="btn-primary no-underline">+ Add Member</Link>}
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header rounded-tl-xl">Name</th>
                <th className="table-header">Progress</th>
                <th className="table-header">Mentor</th>
                <th className="table-header rounded-tr-xl">Classification</th>
              </tr>
            </thead>
            <tbody>
              {members.slice(0, 6).map(member => (
                <tr key={member.id} className="table-row">
                  <td className="table-cell font-medium">{member.name}</td>
                  <td className="table-cell">
                    <ProgressBadge progress={member.progress} />
                  </td>
                  <td className="table-cell">{member.mentor         || '—'}</td>
                  <td className="table-cell">{member.classification || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}

export default Dashboard