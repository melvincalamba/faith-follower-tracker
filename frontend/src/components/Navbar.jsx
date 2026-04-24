import { Link }    from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>🙏 Faith Follower Tracker</span>
      <div style={styles.links}>
        <Link to="/"           style={styles.link}>Dashboard</Link>
        <Link to="/members"    style={styles.link}>Members</Link>
        <Link to="/add-member" style={styles.link}>+ Add Member</Link>
        <span style={{ color: '#aac4ff', fontSize: '13px' }}>
          {user?.name} ({user?.role})
        </span>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '12px 24px',
    backgroundColor: '#1e3a5f', color: 'white',
  },
  brand:  { fontWeight: 'bold', fontSize: '18px' },
  links:  { display: 'flex', gap: '20px', alignItems: 'center' },
  link:   { color: 'white', textDecoration: 'none', fontSize: '14px' },
  logoutBtn: {
    padding: '6px 14px', backgroundColor: 'transparent',
    color: 'white', border: '1px solid white',
    borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
  }
}

export default Navbar