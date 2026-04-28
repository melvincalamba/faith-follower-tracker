function FormField({ label, error, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>
        {label}
        {required && <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>}
      </label>

      {/* Hint text */}
      {hint && (
        <span style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>
          {hint}
        </span>
      )}

      {/* Input with error border */}
      <div style={{ position: 'relative' }}>
        {children}
      </div>

      {/* Error message */}
      {error && (
        <span style={{
          fontSize:  '12px',
          color:     '#e74c3c',
          marginTop: '2px',
          display:   'flex',
          alignItems:'center',
          gap:       '4px',
        }}>
          ⚠️ {error}
        </span>
      )}
    </div>
  )
}

export default FormField