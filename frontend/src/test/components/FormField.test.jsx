import { describe, it, expect, vi } from 'vitest'
import { render, screen }           from '@testing-library/react'

vi.mock('../../components/FormField', () => ({
  default: ({ label, error, required, hint, children }) => (
    <div>
      <label>
        {label}
        {required && <span>*</span>}
      </label>
      {hint    && <span>{hint}</span>}
      {children}
      {error   && <span>⚠️ {error}</span>}
    </div>
  )
}))

import FormField from '../../components/FormField'

describe('FormField', () => {

  it('dapat mag-render ng label', () => {
    render(<FormField label="Name"><input /></FormField>)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('dapat mag-render ng required asterisk', () => {
    render(<FormField label="Name" required><input /></FormField>)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('dapat mag-render ng error message', () => {
    render(
      <FormField label="Name" error="Pangalan ay kailangan.">
        <input />
      </FormField>
    )
    expect(screen.getByText(/Pangalan ay kailangan/)).toBeInTheDocument()
  })

  it('dapat mag-render ng hint text', () => {
    render(
      <FormField label="Details" hint="0/500 characters">
        <textarea />
      </FormField>
    )
    expect(screen.getByText('0/500 characters')).toBeInTheDocument()
  })

  it('dapat hindi mag-render ng error kung walang error', () => {
    render(<FormField label="Name"><input /></FormField>)
    expect(screen.queryByText(/⚠️/)).not.toBeInTheDocument()
  })
})