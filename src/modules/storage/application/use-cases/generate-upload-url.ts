import { UnsupportedContentTypeException } from '../../domain/exceptions'
import { StorageRepository, GenerateUploadUrlResult } from '../../domain/repositories'

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number]

export interface GenerateUploadUrlCommand {
  userId: string
  contentType: string
  folder?: string
}

export class GenerateUploadUrl {
  constructor(private readonly storageRepo: StorageRepository) {}

  async execute(command: GenerateUploadUrlCommand): Promise<GenerateUploadUrlResult> {
    if (!ALLOWED_CONTENT_TYPES.includes(command.contentType as AllowedContentType)) {
      throw new UnsupportedContentTypeException(command.contentType)
    }

    const ext = this.extensionFor(command.contentType as AllowedContentType)
    const folder = command.folder ?? 'uploads'
    const key = `${folder}/${command.userId}/${crypto.randomUUID()}${ext}`

    return this.storageRepo.generateUploadUrl({
      key,
      contentType: command.contentType as AllowedContentType
    })
  }

  private extensionFor(contentType: AllowedContentType): string {
    const map: Record<AllowedContentType, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp'
    }
    return map[contentType]
  }
}
