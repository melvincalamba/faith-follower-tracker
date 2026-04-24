import { useState, useEffect } from 'react'
import { mockMembers } from '../data/mockData'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [members, setMembers] = useState([])

  // Simulating an API call using useEffect
  useEffect(() => {
    // Sa susunod na linggo, palitan ito ng actual API call
    setMembers(mockMembers)
  }, [])

  // Computed stats
  const totalMembers   = members.length
  const inPreFIC       = members.filter(m => m.progress === 'Pre-FIC').length
  const inCellDev      = members.filter(m => m.progress === 'CellDev').length
  const inProgress     = members.filter(m =>
    ['FIC1', 'FIC2', 'Pre-CellDev'].includes(m.progress)
  ).length

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <Link to="/add-member" style={addBtn}>+ Add Member</Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
        <StatCard label="Total Members"  value={totalMembers} color="#1e3a5f" />
        <StatCard label="Pre-FIC"        value={inPreFIC}     color="#e67e22" />
        <StatCard label="In Progress"    value={inProgress}   color="#2980b9" />
        <StatCard label="Cell Dev"       value={inCellDev}    color="#27ae60" />
      </div>

      {/* Recent Members */}
      <h3 style={{ marginTop: '32px' }}>Recent Members</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
            <th style={th}>Name</th>
            <th style={th}>Progress</th>
            <th style={th}>Mentor</th>
            <th style={th}>Classification</th>
          </tr>
        </thead>
        <tbody>
          {members.slice(0, 5).map(member => (
            <tr key={member.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={td}>{member.name}</td>
              <td style={td}>
                <ProgressBadge progress={member.progress} />
              </td>
              <td style={td}>{member.mentor}</td>
              <td style={td}>{member.classification}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      padding: '20px 28px',
      backgroundColor: color,
      borderRadius: '8px',
      minWidth: '150px',
      textAlign: 'center',
      color: 'white',
    }}>
      <h2 style={{ margin: 0 }}>{value}</h2>
      <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.85 }}>{label}</p>
    </div>
  )
}

function ProgressBadge({ progress }) {
  const colors = {
    'Pre-FIC':     '#e67e22',
    'FIC1':        '#2980b9',
    'FIC2':        '#8e44ad',
    'Pre-CellDev': '#16a085',
    'CellDev':     '#27ae60',
  }
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

const th = { padding: '10px 16px', textAlign: 'left' }
const td = { padding: '10px 16px' }
const addBtn = {
  padding: '8px 16px',
  backgroundColor: '#1e3a5f',
  color: 'white',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '14px',
}

export default Dashboard