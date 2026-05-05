import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth }        from './context/AuthContext'
import Navbar             from './components/Navbar'
import ProtectedRoute     from './components/ProtectedRoute'
import Dashboard          from './pages/Dashboard'
import Members            from './pages/Members'
import AddMember          from './pages/AddMember'
import Login              from './pages/Login'
import NotFound           from './pages/NotFound'
import EditMember         from './pages/EditMember'
import MemberDetail       from './pages/MemberDetail'
import MentorDashboard    from './pages/MentorDashboard'
import Register           from './pages/Register'
import UserManagement     from './pages/UserManagement'

function AppLayout() {
  const { user } = useAuth()

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        }/>
        <Route path="/members" element={
          <ProtectedRoute><Members /></ProtectedRoute>
        }/>
        <Route path="/add-member" element={
          <ProtectedRoute><AddMember /></ProtectedRoute>
        }/>
        <Route path="/members/:id" element={
          <ProtectedRoute><MemberDetail /></ProtectedRoute>
        }/>
        <Route path="/members/:id/edit" element={
          <ProtectedRoute><EditMember /></ProtectedRoute>
        }/>
        <Route path="/mentor-dashboard" element={
          <ProtectedRoute><MentorDashboard /></ProtectedRoute>
        }/>
        <Route path="/register" element={<Register />} /> {/* Public */}
        <Route path="/users" element={
          <ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>
        }/>
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App