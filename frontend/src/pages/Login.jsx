function Login() {
  return (
    <div style={{ padding: '60px 24px', maxWidth: '360px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>🙏 Faith Follower Tracker</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>Email
          <input type="email" placeholder="you@email.com" style={input} />
        </label>
        <label>Password
          <input type="password" placeholder="••••••••" style={input} />
        </label>
        <button style={btn}>Login</button>
      </div>
    </div>
  )
}

const input = {
  display: 'block', width: '100%', padding: '8px',
  marginTop: '4px', borderRadius: '4px',
  border: '1px solid #ccc', fontSize: '14px',
}

const btn = {
  padding: '10px', backgroundColor: '#1e3a5f',
  color: 'white', border: 'none',
  borderRadius: '4px', cursor: 'pointer', fontSize: '14px',
}

export default Login