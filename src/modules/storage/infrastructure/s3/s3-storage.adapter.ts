import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@src/config/env'
import { GenerateUploadUrlInput, GenerateUploadUrlResult, StorageRepository } from '../../domain/repositories'

export class S3StorageAdapter implements StorageRepository {
  private readonly client: S3Client

  constructor() {
    this.client = new S3Client({
      region: env.STORAGE_REGION,
      credentials: {
        accessKeyId: env.STORAGE_ACCESS_KEY,
        secretAccessKey: env.STORAGE_SECRET_KEY
      },
      ...(env.STORAGE_ENDPOINT && {
        endpoint: env.STORAGE_ENDPOINT,
        forcePathStyle: true
      })
    })
  }

  async generateUploadUrl(input: GenerateUploadUrlInput): Promise<GenerateUploadUrlResult> {
    const command = new PutObjectCommand({
      Bucket: env.STORAGE_BUCKET,
      Key: input.key,
      ContentType: input.contentType
    })

    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 300 })
    const publicUrl = `${env.STORAGE_PUBLIC_URL}/${input.key}`

    return { uploadUrl, publicUrl }
  }
}
