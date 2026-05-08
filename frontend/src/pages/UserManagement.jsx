import { useState, useEffect }               from 'react'
import toast                                 from 'react-hot-toast'
import { getUsers, approveUser, deleteUser } from '../services/api'
import LoadingSpinner                        from '../components/LoadingSpinner'
import ErrorMessage                          from '../components/ErrorMessage'
import EmptyState                            from '../components/EmptyState'
import ConfirmModal                          from '../components/ConfirmModal'

function UserManagement() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [modal, setModal] = useState({ isOpen: false, id: null, name: '' })

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getUsers()
      setUsers(res.data)
    } catch {
      setError('Hindi ma-load ang mga users. Subukan ulit.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleApprove = async (id, name) => {
    try {
      await approveUser(id)
      setUsers(prev => prev.map(u =>
        u.id === id ? { ...u, status: 'active' } : u
      ))
      toast.success(`${name} ay na-approve na! 🙏`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Hindi ma-approve. Subukan ulit.')
    }
  }

  const openDeleteModal = (id, name) => {
    setModal({ isOpen: true, id, name })
  }

  const handleDelete = async () => {
    setModal({ isOpen: false, id: null, name: '' })
    try {
      await deleteUser(modal.id)
      setUsers(prev => prev.filter(u => u.id !== modal.id))
      toast.success(`${modal.name} ay na-delete na. 🙏`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Hindi ma-delete. Subukan ulit.')
    }
  }

  const handleCancelDelete = () => {
    setModal({ isOpen: false, id: null, name: '' })
  }

  const pending = users.filter(u => u.status === 'pending')
  const active  = users.filter(u => u.status === 'active')

  if (loading) return <LoadingSpinner message="Kinukuha ang mga users..." />
  if (error)   return <ErrorMessage  message={error} onRetry={fetchUsers} />

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">User Management</h1>
        <p className="text-warm-500 text-sm mt-1">
          I-approve o i-reject ang mga bagong registered users.
        </p>
      </div>

      {/* Pending Users */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="section-title m-0">Pending Approval</h2>
          {pending.length > 0 && (
            <span className="badge bg-orange-100 text-orange-700">
              {pending.length} pending
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <EmptyState
            icon="✅"
            title="Walang Pending Users"
            message="Lahat ng users ay approved na."
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header rounded-tl-xl">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Date Registered</th>
                <th className="table-header rounded-tr-xl text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pending.map(user => (
                <tr key={user.id} className="border-b border-warm-100">
                  <td className="table-cell font-semibold">{user.name}</td>
                  <td className="table-cell text-warm-500">{user.email}</td>
                  <td className="table-cell text-warm-500">
                    {new Date(user.created_at).toLocaleDateString('en-PH', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleApprove(user.id, user.name)}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => openDeleteModal(user.id, user.name)}
                        className="btn-danger text-xs px-3 py-1.5"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Active Users */}
      <div className="card">
        <h2 className="section-title">Active Users ({active.length})</h2>
        {active.length === 0 ? (
          <EmptyState
            icon="👥"
            title="Walang Active Users"
            message="Mag-approve ng pending users para maging active."
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header rounded-tl-xl">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Role</th>
                <th className="table-header rounded-tr-xl text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {active.map(user => (
                <tr key={user.id} className="border-b border-warm-100">
                  <td className="table-cell font-semibold">{user.name}</td>
                  <td className="table-cell text-warm-500">{user.email}</td>
                  <td className="table-cell">
                    <span className={`badge ${
                      user.role === 'admin'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <button
                      onClick={() => openDeleteModal(user.id, user.name)}
                      className="btn-danger text-xs px-3 py-1.5"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={modal.isOpen}
        title="I-delete ang User?"
        message={`Sigurado ka bang gusto mong i-delete si ${modal.name}? Hindi na ito mababawi.`}
        confirmLabel="🗑️ I-delete"
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />

    </div>
  )
}

export default UserManagement