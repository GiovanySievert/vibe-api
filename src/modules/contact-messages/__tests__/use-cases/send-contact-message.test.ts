import { describe, it, expect, beforeEach } from 'bun:test'
import { SendContactMessage } from '../../application/use-cases'
import { MockContactMessageRepository } from '../mocks/contact-message.repository.mock'

describe('SendContactMessage', () => {
  let sendContactMessage: SendContactMessage
  let mockRepo: MockContactMessageRepository

  beforeEach(() => {
    mockRepo = new MockContactMessageRepository()
    sendContactMessage = new SendContactMessage(mockRepo)
  })

  it('should send a contact message successfully', async () => {
    const userId = 'user-1'
    const message = 'Ótimo app!'

    const result = await sendContactMessage.execute(userId, message)

    expect(result).toBeDefined()
    expect(result.userId).toBe(userId)
    expect(result.message).toBe(message)
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
  })

  it('should persist the message in the repository', async () => {
    await sendContactMessage.execute('user-1', 'Tenho uma dúvida')
    await sendContactMessage.execute('user-2', 'Sugestão de melhoria')

    const all = mockRepo.getAll()
    expect(all).toHaveLength(2)
  })
})
