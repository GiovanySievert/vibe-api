import { describe, it, expect, beforeEach } from 'bun:test'
import { CheckUsernameAvailability } from '../../application/use-cases/check-username-availability'
import { MockUserRepository } from '../mocks/user.repository.mock'

describe('CheckUsernameAvailability', () => {
  let repository: MockUserRepository
  let useCase: CheckUsernameAvailability

  beforeEach(() => {
    repository = new MockUserRepository()
    useCase = new CheckUsernameAvailability(repository)
  })

  it('should return available true when username does not exist', async () => {
    const result = await useCase.execute('newuser')

    expect(result.available).toBe(true)
  })

  it('should return available false when username already exists', async () => {
    repository.seed(['existinguser', 'anotheruser'])

    const result = await useCase.execute('existinguser')

    expect(result.available).toBe(false)
  })

  it('should be case sensitive when checking username', async () => {
    repository.seed(['JohnDoe'])

    const resultLowerCase = await useCase.execute('johndoe')
    const resultUpperCase = await useCase.execute('JohnDoe')

    expect(resultLowerCase.available).toBe(true)
    expect(resultUpperCase.available).toBe(false)
  })

  it('should handle special characters in username', async () => {
    const specialUsername = 'user_123-test'
    repository.seed([specialUsername])

    const result = await useCase.execute(specialUsername)

    expect(result.available).toBe(false)
  })

  it('should check availability for multiple different usernames', async () => {
    repository.seed(['alice', 'bob', 'charlie'])

    const result1 = await useCase.execute('alice')
    const result2 = await useCase.execute('david')
    const result3 = await useCase.execute('bob')
    const result4 = await useCase.execute('eve')

    expect(result1.available).toBe(false)
    expect(result2.available).toBe(true)
    expect(result3.available).toBe(false)
    expect(result4.available).toBe(true)
  })

  it('should handle empty username list', async () => {
    repository.seed([])

    const result = await useCase.execute('anyusername')

    expect(result.available).toBe(true)
  })
})
