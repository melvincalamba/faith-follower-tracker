function Dashboard() {
  return (
    <div style={{ padding: '24px' }}>
      <h2>Dashboard</h2>
      <p>Welcome! Here's an overview of all members.</p>

      {/* Placeholder stats */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        <StatCard label="Total Members"  value="0" />
        <StatCard label="In Pre-FIC"     value="0" />
        <StatCard label="In CellDev"     value="0" />
      </div>
    </div>
  )
}

// Reusable stat card component (props demo!)
function StatCard({ label, value }) {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f4ff',
      borderRadius: '8px',
      minWidth: '150px',
      textAlign: 'center',
    }}>
      <h3 style={{ margin: 0 }}>{value}</h3>
      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#555' }}>{label}</p>
    </div>
  )
}

export default Dashboard