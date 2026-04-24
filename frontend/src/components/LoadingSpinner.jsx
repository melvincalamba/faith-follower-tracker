import { ClipLoader } from 'react-spinners'

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '60px 24px',
      gap:            '16px',
    }}>
      <ClipLoader color="#1e3a5f" size={48} />
      <p style={{ color: '#888', fontSize: '14px' }}>{message}</p>
    </div>
  )
}

export default LoadingSpinner