import { describe, it, expect } from 'vitest'
import { render, screen }       from '@testing-library/react'
import ProgressBadge            from '../../components/ProgressBadge'

describe('ProgressBadge', () => {

  it('dapat mag-render ng correct na progress label', () => {
    render(<ProgressBadge progress="FIC1" />)
    expect(screen.getByText('FIC1')).toBeInTheDocument()
  })

  it('dapat mag-render ang lahat ng valid progress stages', () => {
    const stages = ['Pre-FIC', 'FIC1', 'FIC2', 'Pre-CellDev', 'CellDev']
    stages.forEach(stage => {
      const { unmount } = render(<ProgressBadge progress={stage} />)
      expect(screen.getByText(stage)).toBeInTheDocument()
      unmount()
    })
  })

  it('dapat mag-render kahit unknown ang progress', () => {
    render(<ProgressBadge progress="Unknown" />)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })
})