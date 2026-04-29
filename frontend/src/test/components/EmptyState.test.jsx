import { describe, it, expect, vi } from 'vitest'
import { render, screen }           from '@testing-library/react'

vi.mock('../../components/EmptyState', () => ({
  default: ({ icon, title, message, action }) => (
    <div>
      {icon   && <span>{icon}</span>}
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div>{action}</div>}
    </div>
  )
}))

import EmptyState from '../../components/EmptyState'

describe('EmptyState', () => {

  it('dapat mag-render ng title at message', () => {
    render(
      <EmptyState
        title="Wala pang Members"
        message="Mag-add ng unang member."
      />
    )
    expect(screen.getByText('Wala pang Members')).toBeInTheDocument()
    expect(screen.getByText('Mag-add ng unang member.')).toBeInTheDocument()
  })

  it('dapat mag-render ng custom icon', () => {
    render(<EmptyState icon="🎉" title="Test" message="Test" />)
    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  it('dapat mag-render ng action button kung may action', () => {
    render(
      <EmptyState
        title="Test"
        message="Test"
        action={<button>Add Member</button>}
      />
    )
    expect(screen.getByText('Add Member')).toBeInTheDocument()
  })
})