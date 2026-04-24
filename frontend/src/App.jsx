import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard      from './pages/Dashboard'
import Members        from './pages/Members'
import AddMember      from './pages/AddMember'
import Login          from './pages/Login'
import Navbar         from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth }    from './context/AuthContext'

function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App