import { describe, it, expect, beforeEach } from 'bun:test'
import { GenerateUploadUrl } from '../../application/use-cases/generate-upload-url'
import { UnsupportedContentTypeException } from '../../domain/exceptions'
import {
  GenerateUploadUrlInput,
  GenerateUploadUrlResult,
  StorageRepository
} from '../../domain/repositories'

class MockStorageRepository implements StorageRepository {
  public calls: GenerateUploadUrlInput[] = []
  public response: GenerateUploadUrlResult = {
    uploadUrl: 'https://s3.example.com/signed-url',
    publicUrl: 'https://cdn.example.com/public-url'
  }
  public shouldThrow: Error | null = null

  async generateUploadUrl(input: GenerateUploadUrlInput): Promise<GenerateUploadUrlResult> {
    this.calls.push(input)
    if (this.shouldThrow) throw this.shouldThrow
    return this.response
  }
}

describe('GenerateUploadUrl', () => {
  let storageRepo: MockStorageRepository
  let useCase: GenerateUploadUrl

  beforeEach(() => {
    storageRepo = new MockStorageRepository()
    useCase = new GenerateUploadUrl(storageRepo)
  })

  it('should generate an upload url for a valid jpeg content type', async () => {
    const result = await useCase.execute({
      userId: 'user-1',
      contentType: 'image/jpeg'
    })

    expect(result.uploadUrl).toBe('https://s3.example.com/signed-url')
    expect(result.publicUrl).toBe('https://cdn.example.com/public-url')
    expect(storageRepo.calls).toHaveLength(1)

    const call = storageRepo.calls[0]
    expect(call.contentType).toBe('image/jpeg')
    expect(call.key.startsWith('uploads/user-1/')).toBe(true)
    expect(call.key.endsWith('.jpg')).toBe(true)
  })

  it('should generate an upload url for a valid png content type with .png extension', async () => {
    await useCase.execute({
      userId: 'user-2',
      contentType: 'image/png'
    })

    const call = storageRepo.calls[0]
    expect(call.contentType).toBe('image/png')
    expect(call.key.endsWith('.png')).toBe(true)
    expect(call.key.startsWith('uploads/user-2/')).toBe(true)
  })

  it('should generate an upload url for a valid webp content type with .webp extension', async () => {
    await useCase.execute({
      userId: 'user-3',
      contentType: 'image/webp'
    })

    const call = storageRepo.calls[0]
    expect(call.contentType).toBe('image/webp')
    expect(call.key.endsWith('.webp')).toBe(true)
  })

  it('should use a custom folder when provided', async () => {
    await useCase.execute({
      userId: 'user-4',
      contentType: 'image/jpeg',
      folder: 'avatars'
    })

    const call = storageRepo.calls[0]
    expect(call.key.startsWith('avatars/user-4/')).toBe(true)
  })

  it('should default folder to "uploads" when not provided', async () => {
    await useCase.execute({
      userId: 'user-5',
      contentType: 'image/png'
    })

    const call = storageRepo.calls[0]
    expect(call.key.startsWith('uploads/user-5/')).toBe(true)
  })

  it('should generate unique keys across calls for the same user and content type', async () => {
    await useCase.execute({ userId: 'user-6', contentType: 'image/jpeg' })
    await useCase.execute({ userId: 'user-6', contentType: 'image/jpeg' })

    expect(storageRepo.calls).toHaveLength(2)
    expect(storageRepo.calls[0].key).not.toBe(storageRepo.calls[1].key)
  })

  it('should throw UnsupportedContentTypeException for image/gif', async () => {
    expect(async () => {
      await useCase.execute({
        userId: 'user-7',
        contentType: 'image/gif'
      })
    }).toThrow(UnsupportedContentTypeException)

    expect(storageRepo.calls).toHaveLength(0)
  })

  it('should throw UnsupportedContentTypeException for application/pdf', async () => {
    expect(async () => {
      await useCase.execute({
        userId: 'user-8',
        contentType: 'application/pdf'
      })
    }).toThrow(UnsupportedContentTypeException)

    expect(storageRepo.calls).toHaveLength(0)
  })

  it('should throw UnsupportedContentTypeException for text/html (security: prevent script upload)', async () => {
    expect(async () => {
      await useCase.execute({
        userId: 'user-9',
        contentType: 'text/html'
      })
    }).toThrow(UnsupportedContentTypeException)

    expect(storageRepo.calls).toHaveLength(0)
  })

  it('should throw UnsupportedContentTypeException for an empty content type', async () => {
    expect(async () => {
      await useCase.execute({
        userId: 'user-10',
        contentType: ''
      })
    }).toThrow(UnsupportedContentTypeException)

    expect(storageRepo.calls).toHaveLength(0)
  })

  it('should propagate errors thrown by the storage repository', async () => {
    storageRepo.shouldThrow = new Error('S3 unavailable')

    expect(async () => {
      await useCase.execute({
        userId: 'user-11',
        contentType: 'image/jpeg'
      })
    }).toThrow('S3 unavailable')
  })
})
