function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div style={{ padding: '60px 24px', maxWidth: '360px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>🙏 Faith Follower Tracker</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>Email
          <input type="email" name="email" placeholder="you@email.com" style={input} onChange={handleChange} />
        </label>
        <label>Password
          <input type="password" name="password" placeholder="••••••••" style={input} onChange={handleChange} />
        </label>
        <button style={btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  )
}

async function handleLogin() {
  setError('')
  setLoading(true)
  try {
    const res = await loginUser(form)
    login(res.data.token, res.data.user)

    // Slight delay para ma-update muna ang AuthContext
    // bago mag-navigate
    setTimeout(() => navigate('/'), 100)
  } catch (err) {
    setError(err.response?.data?.error || 'May error sa login.')
  } finally {
    setLoading(false)
  }
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