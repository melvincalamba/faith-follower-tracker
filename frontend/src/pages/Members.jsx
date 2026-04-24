// Sample static data muna — real data from API later
const sampleMembers = [
  { id: 1, name: 'Juan dela Cruz',  progress: 'FIC1',        mentor: 'Kuya Mark', classification: 'Undergrad' },
  { id: 2, name: 'Maria Santos',    progress: 'Pre-CellDev', mentor: 'Ate Joy',   classification: 'Professional' },
  { id: 3, name: 'Pedro Reyes',     progress: 'Pre-FIC',     mentor: 'Kuya Mark', classification: 'Senior High' },
]

function Members() {
  return (
    <div style={{ padding: '24px' }}>
      <h2>Members</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
            <th style={th}>Name</th>
            <th style={th}>Progress</th>
            <th style={th}>Mentor</th>
            <th style={th}>Classification</th>
          </tr>
        </thead>
        <tbody>
          {sampleMembers.map(member => (
            <MemberRow key={member.id} member={member} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Reusable row component with props
function MemberRow({ member }) {
  return (
    <tr style={{ borderBottom: '1px solid #ddd' }}>
      <td style={td}>{member.name}</td>
      <td style={td}>{member.progress}</td>
      <td style={td}>{member.mentor}</td>
      <td style={td}>{member.classification}</td>
    </tr>
  )
}

const th = { padding: '10px 16px', textAlign: 'left' }
const td = { padding: '10px 16px' }

export default Members