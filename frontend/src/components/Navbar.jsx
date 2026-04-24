import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>🙏 Faith Follower Tracker</span>
      <div style={styles.links}>
        <Link to="/"           style={styles.link}>Dashboard</Link>
        <Link to="/mentor-dashboard" style={styles.link}>Mentors</Link>
        <Link to="/members"    style={styles.link}>Members</Link>
        <Link to="/add-member" style={styles.link}>+ Add Member</Link>
        <Link to="/settings"   style={styles.link}>Settings</Link>
        <Link to="/logout"     style={styles.link}>Logout</Link>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#1e3a5f',
    color: 'white',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
  }
}

export default Navbar