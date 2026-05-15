import { describe, it, expect, beforeEach } from 'bun:test'
import { GenerateUniqueUsername } from '../../application/use-cases/generate-unique-username'
import { MockUserRepository } from '../mocks/user.repository.mock'

describe('GenerateUniqueUsername', () => {
  let repository: MockUserRepository
  let useCase: GenerateUniqueUsername

  beforeEach(() => {
    repository = new MockUserRepository()
    useCase = new GenerateUniqueUsername(repository)
  })

  it('generates a username prefixed with the email local part', async () => {
    const username = await useCase.execute('giovany@example.com')

    expect(username.startsWith('giovany_')).toBe(true)
    expect(username.length).toBeGreaterThan('giovany_'.length)
  })

  it('falls back to the default seed when the email local part is too short', async () => {
    const username = await useCase.execute('a@b.com')

    expect(username.startsWith('user_')).toBe(true)
  })

  it('falls back to the default seed when the email is missing', async () => {
    const username = await useCase.execute(null)

    expect(username.startsWith('user_')).toBe(true)
  })

  it('strips invalid characters and lowercases the seed', async () => {
    const username = await useCase.execute('Foo.Bar+Baz@example.com')

    expect(username.startsWith('foobarbaz_')).toBe(true)
  })

  it('retries when the generated candidate already exists', async () => {
    let calls = 0
    repository.existsByUsername = async () => {
      calls++
      return calls === 1
    }

    const username = await useCase.execute('giovany@example.com')

    expect(calls).toBe(2)
    expect(username.startsWith('giovany_')).toBe(true)
  })

  it('throws after exhausting the attempt budget', async () => {
    repository.existsByUsername = async () => true

    await expect(useCase.execute('giovany@example.com')).rejects.toThrow(/unique username/)
  })
})
