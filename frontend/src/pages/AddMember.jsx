function AddMember() {
  return (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <h2>Add New Member</h2>

      {/* Low-fi form — wiring sa backend later */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>Name
          <input type="text" placeholder="Full Name" style={input} />
        </label>

        <label>Progress Stage
          <select style={input}>
            <option>Pre-FIC</option>
            <option>FIC1</option>
            <option>FIC2</option>
            <option>Pre-CellDev</option>
            <option>CellDev</option>
          </select>
        </label>

        <label>Classification
          <select style={input}>
            <option>Grade School</option>
            <option>Junior High</option>
            <option>Senior High</option>
            <option>Undergrad</option>
            <option>Professional</option>
            <option>TBA</option>
          </select>
        </label>

        <label>Mentor
          <input type="text" placeholder="Mentor Name" style={input} />
        </label>

        <label>Details
          <textarea placeholder="Life updates, notes..." style={{ ...input, height: '80px' }} />
        </label>

        <button style={btn}>Add Member</button>
      </div>
    </div>
  )
}

const input = {
  display: 'block',
  width: '100%',
  padding: '8px',
  marginTop: '4px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
}

const btn = {
  padding: '10px',
  backgroundColor: '#1e3a5f',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
}

export default AddMember