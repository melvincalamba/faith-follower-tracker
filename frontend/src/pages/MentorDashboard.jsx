import { useState, useEffect }  from 'react'
import { useNavigate }          from 'react-router-dom'
import { getMentors }           from '../services/api'
import { useAuth }              from '../context/AuthContext'
import LoadingSpinner           from '../components/LoadingSpinner'
import ErrorMessage             from '../components/ErrorMessage'
import EmptyState               from '../components/EmptyState'
import ProgressBadge            from '../components/ProgressBadge'
import axios                    from 'axios'

function MentorDashboard() {
  const { user }                      = useAuth()
  const navigate                      = useNavigate()
  const [mentors,       setMentors]   = useState([])
  const [selectedMentor,setSelected]  = useState(null)
  const [members,       setMembers]   = useState([])
  const [loading,       setLoading]   = useState(true)
  const [loadingMembers,setLoadingM]  = useState(false)
  const [error,         setError]     = useState(null)

  // I-fetch ang mentors list
  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true)
      try {
        const res = await getMentors()
        setMentors(res.data)

        // Kung mentor ang naka-login, auto-select siya
        if (user?.role === 'mentor') {
          const self = res.data.find(m => m.id === user.id)
          if (self) handleSelectMentor(self, res.data)
        }
      } catch (err) {
        setError('Hindi ma-load ang mga mentor. Subukan ulit.')
      } finally {
        setLoading(false)
      }
    }
    fetchMentors()
  }, [])

  const handleSelectMentor = async (mentor) => {
    setSelected(mentor)
    setLoadingM(true)
    try {
      const token = localStorage.getItem('fft_token')
      const res   = await axios.get(
        `http://localhost:3001/api/mentors/${mentor.id}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMembers(res.data)
    } catch (err) {
      setMembers([])
    } finally {
      setLoadingM(false)
    }
  }

  if (loading) return <LoadingSpinner message="Kinukuha ang mga mentor..." />
  if (error)   return <ErrorMessage  message={error} />

  return (
    <div style={{ padding: '24px' }}>
      <h2>Mentor Dashboard</h2>

      <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>

        {/* Mentor List — Admin lang makakakita nito */}
        {user?.role === 'admin' && (
          <div style={{ width: '220px', flexShrink: 0 }}>
            <h4 style={{ margin: '0 0 12px', color: '#555' }}>Mga Mentor</h4>
            {mentors.length === 0 ? (
              <p style={{ color: '#888', fontSize: '13px' }}>Wala pang mentors.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mentors.map(mentor => (
                  <button
                    key={mentor.id}
                    onClick={() => handleSelectMentor(mentor)}
                    style={{
                      padding:         '10px 14px',
                      textAlign:       'left',
                      border:          '1px solid #ddd',
                      borderRadius:    '8px',
                      cursor:          'pointer',
                      backgroundColor: selectedMentor?.id === mentor.id
                        ? '#1e3a5f' : 'white',
                      color:           selectedMentor?.id === mentor.id
                        ? 'white' : '#333',
                      fontSize:        '14px',
                      transition:      'all 0.15s',
                    }}
                  >
                    👤 {mentor.name}
                    <span style={{ display: 'block', fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                      {mentor.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members of Selected Mentor */}
        <div style={{ flex: 1 }}>
          {!selectedMentor ? (
            <EmptyState
              icon="👆"
              title="Pumili ng Mentor"
              message="I-click ang isang mentor sa kaliwa para makita ang kanyang mga members."
            />
          ) : loadingMembers ? (
            <LoadingSpinner message="Kinukuha ang mga members..." />
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>
                  Members ni {selectedMentor.name}
                </h3>
                <p style={{ margin: '4px 0 0', color: '#888', fontSize: '13px' }}>
                  {members.length} member{members.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Progress Summary */}
              {members.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {['Pre-FIC','FIC1','FIC2','Pre-CellDev','CellDev'].map(stage => {
                    const count = members.filter(m => m.progress === stage).length
                    if (count === 0) return null
                    return (
                      <div key={stage} style={{
                        padding: '6px 14px',
                        backgroundColor: '#f0f4ff',
                        borderRadius: '20px',
                        fontSize: '13px',
                        color: '#1e3a5f',
                        fontWeight: '600',
                      }}>
                        <ProgressBadge progress={stage} /> ×{count}
                      </div>
                    )
                  })}
                </div>
              )}

              {members.length === 0 ? (
                <EmptyState
                  icon="📋"
                  title="Walang Members"
                  message={`Si ${selectedMentor.name} ay wala pang assigned na members.`}
                />
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                      <th style={th}>Name</th>
                      <th style={th}>Progress</th>
                      <th style={th}>Classification</th>
                      <th style={th}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr
                        key={member.id}
                        onClick={() => navigate(`/members/${member.id}`)}
                        style={{ borderBottom: '1px solid #ddd', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={td}>{member.name}</td>
                        <td style={td}><ProgressBadge progress={member.progress} /></td>
                        <td style={td}>{member.classification || '—'}</td>
                        <td style={{ ...td, color: '#555', fontSize: '13px' }}>
                          {member.details || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const th = { padding: '10px 16px', textAlign: 'left' }
const td = { padding: '10px 16px' }

export default MentorDashboard