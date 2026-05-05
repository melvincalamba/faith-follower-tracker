import { Navigate, useLocation } from 'react-router-dom'
import { useAuth }               from '../context/AuthContext'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const location          = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-warm-400">Loading...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  // Mentor na pumunta sa add-member — i-redirect sa mentor dashboard
  if (user.role === 'mentor' && location.pathname === '/add-member') {
    return <Navigate to="/mentor-dashboard" replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute