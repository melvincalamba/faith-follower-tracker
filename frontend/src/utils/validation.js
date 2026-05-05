// ─── Member Form Validation ───────────────────────────────
export const validateMemberForm = (form) => {
  const errors = {}

  // Name
  if (!form.name?.trim()) {
    errors.name = 'Pangalan ay kailangan.'
  } else if (form.name.trim().length < 2) {
    errors.name = 'Pangalan ay dapat hindi bababa sa 2 characters.'
  } else if (form.name.trim().length > 100) {
    errors.name = 'Pangalan ay hindi dapat hihigit sa 100 characters.'
  }

  // Progress
  const validStages = ['Pre-FIC', 'FIC1', 'FIC2', 'Pre-CellDev', 'CellDev']
  if (!form.progress || !validStages.includes(form.progress)) {
    errors.progress = 'Pumili ng valid na progress stage.'
  }

  // Classification
  const validClassifications = [
    'Grade School', 'Junior High', 'Senior High',
    'Undergrad', 'Professional', 'TBA'
  ]
  if (!form.classification || !validClassifications.includes(form.classification)) {
    errors.classification = 'Pumili ng valid na classification.'
  }

  // Details — optional pero may max length
  if (form.details && form.details.length > 500) {
    errors.details = 'Details ay hindi dapat hihigit sa 500 characters.'
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}

// ─── Login Form Validation ────────────────────────────────
export const validateLoginForm = (form) => {
  const errors = {}

  if (!form.email?.trim()) {
    errors.email = 'Email ay kailangan.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Hindi valid na email format.'
  }

  if (!form.password) {
    errors.password = 'Password ay kailangan.'
  } else if (form.password.length < 6) {
    errors.password = 'Password ay dapat hindi bababa sa 6 characters.'
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}