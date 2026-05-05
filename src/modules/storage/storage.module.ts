import { GenerateUploadUrl } from './application/use-cases'
import { StorageController } from './infrastructure/http/controllers'
import { S3StorageAdapter } from './infrastructure/s3'

export class StorageModule {
  public readonly storageController: StorageController

  constructor() {
    const storageRepo = new S3StorageAdapter()
    const generateUploadUrlService = new GenerateUploadUrl(storageRepo)

    this.storageController = new StorageController(generateUploadUrlService)
  }
}
