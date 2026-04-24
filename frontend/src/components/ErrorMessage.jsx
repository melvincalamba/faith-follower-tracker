function ErrorMessage({ message, onRetry }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '60px 24px',
      gap:            '12px',
      textAlign:      'center',
    }}>
      <span style={{ fontSize: '48px' }}>⚠️</span>
      <h3 style={{ margin: 0, color: '#c0392b' }}>May Error na Nangyari</h3>
      <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{
          marginTop:       '8px',
          padding:         '8px 20px',
          backgroundColor: '#1e3a5f',
          color:           'white',
          border:          'none',
          borderRadius:    '6px',
          cursor:          'pointer',
          fontSize:        '14px',
        }}>
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage