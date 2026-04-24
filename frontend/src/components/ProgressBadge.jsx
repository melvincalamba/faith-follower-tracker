const colors = {
  'Pre-FIC':     '#e67e22',
  'FIC1':        '#2980b9',
  'FIC2':        '#8e44ad',
  'Pre-CellDev': '#16a085',
  'CellDev':     '#27ae60',
}

function ProgressBadge({ progress }) {
  return (
    <span style={{
      backgroundColor: colors[progress] || '#999',
      color: 'white',
      padding: '3px 10px',
      borderRadius: '12px',
      fontSize: '12px',
    }}>
      {progress}
    </span>
  )
}

export default ProgressBadge