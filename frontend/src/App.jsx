import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import AddMember from './pages/AddMember'
import Login from './pages/Login'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"           element={<Dashboard />} />
        <Route path="/members"    element={<Members />} />
        <Route path="/add-member" element={<AddMember />} />
        <Route path="/login"      element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App