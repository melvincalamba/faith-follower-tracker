import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div style={{
      minHeight:      '100vh',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '16px',
      textAlign:      'center',
      backgroundColor:'#f0f4ff',
    }}>
      <span style={{ fontSize: '72px' }}>🙏</span>
      <h1 style={{ fontSize: '72px', margin: 0, color: '#1e3a5f' }}>404</h1>
      <h2 style={{ margin: 0, color: '#333' }}>Page Not Found</h2>
      <p style={{ color: '#888', maxWidth: '300px' }}>
        Mukhang naliligaw ka. Wala ang page na hinahanap mo.
      </p>
      <Link to="/" style={{
        padding:         '10px 24px',
        backgroundColor: '#1e3a5f',
        color:           'white',
        borderRadius:    '8px',
        textDecoration:  'none',
        fontSize:        '14px',
      }}>
        Bumalik sa Dashboard
      </Link>
    </div>
  )
}

export default NotFound