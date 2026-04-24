function EmptyState({ icon = '🙏', title, message, action }) {
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
      <span style={{ fontSize: '48px' }}>{icon}</span>
      <h3 style={{ margin: 0, color: '#1e3a5f' }}>{title}</h3>
      <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>{message}</p>
      {action && action}
    </div>
  )
}

export default EmptyState