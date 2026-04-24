import { useState, useEffect } from 'react'
import { mockMembers, progressStages } from '../data/mockData'
import { Link } from 'react-router-dom'

function Members() {
  const [members, setMembers]     = useState([])
  const [search, setSearch]       = useState('')
  const [filterStage, setFilter]  = useState('All')

  useEffect(() => {
    setMembers(mockMembers)
  }, [])

  // Filtered + searched members
  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchStage  = filterStage === 'All' || m.progress === filterStage
    return matchSearch && matchStage
  })

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Members ({filtered.length})</h2>
        <Link to="/add-member" style={addBtn}>+ Add Member</Link>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ display: 'flex', gap: '12px', margin: '16px 0' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select
          value={filterStage}
          onChange={e => setFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="All">All Stages</option>
          {progressStages.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Members Table */}
      {filtered.length === 0 ? (
        <p style={{ color: '#888' }}>Walang members na nahanap.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
              <th style={th}>Name</th>
              <th style={th}>Progress</th>
              <th style={th}>Mentor</th>
              <th style={th}>Classification</th>
              <th style={th}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={td}>{member.name}</td>
                <td style={td}>
                  <ProgressBadge progress={member.progress} />
                </td>
                <td style={td}>{member.mentor}</td>
                <td style={td}>{member.classification}</td>
                <td style={{ ...td, color: '#555', fontSize: '13px' }}>
                  {member.details || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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

const th       = { padding: '10px 16px', textAlign: 'left' }
const td       = { padding: '10px 16px' }
const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '14px',
}
const addBtn = {
  padding: '8px 16px',
  backgroundColor: '#1e3a5f',
  color: 'white',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '14px',
}

export default Members