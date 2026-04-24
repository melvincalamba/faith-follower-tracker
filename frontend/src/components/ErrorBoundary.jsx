import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h2 style={styles.title}>⚠️ May nangyaring mali</h2>
          <p style={styles.message}>{this.state.message}</p>
          <button
            style={styles.btn}
            onClick={() => window.location.href = '/'}
          >
            Bumalik sa Dashboard
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const styles = {
  container: {
    padding: '60px 24px',
    textAlign: 'center',
    maxWidth: '480px',
    margin: '0 auto',
  },
  title:   { color: '#c0392b', fontSize: '22px' },
  message: { color: '#555', fontSize: '14px', margin: '12px 0 24px' },
  btn: {
    padding: '10px 20px',
    backgroundColor: '#1e3a5f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  }
}

export default ErrorBoundary