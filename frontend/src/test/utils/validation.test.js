import { describe, it, expect } from 'vitest'
import { validateMemberForm, validateLoginForm } from '../../utils/validation'

describe('validateMemberForm', () => {

  it('dapat mag-pass ang valid na form', () => {
    const form = {
      name:           'Juan dela Cruz',
      progress:       'FIC1',
      classification: 'Undergrad',
      details:        'Sample details',
    }
    const { isValid, errors } = validateMemberForm(form)
    expect(isValid).toBe(true)
    expect(errors).toEqual({})
  })

  it('dapat mag-fail kung walang name', () => {
    const form = { name: '', progress: 'FIC1', classification: 'Undergrad' }
    const { isValid, errors } = validateMemberForm(form)
    expect(isValid).toBe(false)
    expect(errors.name).toBeDefined()
  })

  it('dapat mag-fail kung name ay less than 2 characters', () => {
    const form = { name: 'J', progress: 'FIC1', classification: 'Undergrad' }
    const { isValid, errors } = validateMemberForm(form)
    expect(isValid).toBe(false)
    expect(errors.name).toMatch(/2 characters/)
  })

  it('dapat mag-fail kung name ay hihigit sa 100 characters', () => {
    const form = {
      name:           'A'.repeat(101),
      progress:       'FIC1',
      classification: 'Undergrad',
    }
    const { isValid, errors } = validateMemberForm(form)
    expect(isValid).toBe(false)
    expect(errors.name).toMatch(/100 characters/)
  })

  it('dapat mag-fail kung invalid ang progress stage', () => {
    const form = { name: 'Juan', progress: 'InvalidStage', classification: 'Undergrad' }
    const { isValid, errors } = validateMemberForm(form)
    expect(isValid).toBe(false)
    expect(errors.progress).toBeDefined()
  })

  it('dapat mag-fail kung invalid ang classification', () => {
    const form = { name: 'Juan', progress: 'FIC1', classification: 'InvalidClass' }
    const { isValid, errors } = validateMemberForm(form)
    expect(isValid).toBe(false)
    expect(errors.classification).toBeDefined()
  })

  it('dapat mag-fail kung details ay hihigit sa 500 characters', () => {
    const form = {
      name:           'Juan',
      progress:       'FIC1',
      classification: 'Undergrad',
      details:        'A'.repeat(501),
    }
    const { isValid, errors } = validateMemberForm(form)
    expect(isValid).toBe(false)
    expect(errors.details).toBeDefined()
  })
})

describe('validateLoginForm', () => {

  it('dapat mag-pass ang valid na login form', () => {
    const form = { email: 'admin@fft.com', password: 'Admin1234' }
    const { isValid } = validateLoginForm(form)
    expect(isValid).toBe(true)
  })

  it('dapat mag-fail kung walang email', () => {
    const form = { email: '', password: 'Admin1234' }
    const { isValid, errors } = validateLoginForm(form)
    expect(isValid).toBe(false)
    expect(errors.email).toBeDefined()
  })

  it('dapat mag-fail kung invalid ang email format', () => {
    const form = { email: 'notanemail', password: 'Admin1234' }
    const { isValid, errors } = validateLoginForm(form)
    expect(isValid).toBe(false)
    expect(errors.email).toBeDefined()
  })

  it('dapat mag-fail kung password ay less than 6 characters', () => {
    const form = { email: 'admin@fft.com', password: '123' }
    const { isValid, errors } = validateLoginForm(form)
    expect(isValid).toBe(false)
    expect(errors.password).toBeDefined()
  })
})