import { describe, it, expect, beforeEach } from 'bun:test'
import { ListContactMessages } from '../../application/use-cases'
import { MockContactMessageRepository } from '../mocks/contact-message.repository.mock'

describe('ListContactMessages', () => {
  let listContactMessages: ListContactMessages
  let mockRepo: MockContactMessageRepository

  beforeEach(() => {
    mockRepo = new MockContactMessageRepository()
    listContactMessages = new ListContactMessages(mockRepo)
  })

  it('should list all contact messages', async () => {
    await mockRepo.create('user-1', 'Elogio ao app')
    await mockRepo.create('user-2', 'Dúvida sobre funcionalidade')

    const result = await listContactMessages.execute()

    expect(result).toHaveLength(2)
    expect(result[0].userId).toBe('user-1')
    expect(result[1].message).toBe('Dúvida sobre funcionalidade')
  })

  it('should return empty array when no messages exist', async () => {
    const result = await listContactMessages.execute()

    expect(result).toHaveLength(0)
  })
})
