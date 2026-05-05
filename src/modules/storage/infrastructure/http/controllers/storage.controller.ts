import { User } from 'better-auth/types'
import { GenerateUploadUrl } from '../../../application/use-cases'

export class StorageController {
  constructor(private readonly generateUploadUrl: GenerateUploadUrl) {}

  async getUploadUrl({ body, user }: { body: { contentType: string; folder?: string }; user: User }) {
    return await this.generateUploadUrl.execute({
      userId: user.id,
      contentType: body.contentType,
      folder: body.folder
    })
  }
}
