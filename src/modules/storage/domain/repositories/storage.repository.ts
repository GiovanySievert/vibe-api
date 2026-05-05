export interface GenerateUploadUrlInput {
  key: string
  contentType: 'image/jpeg' | 'image/png' | 'image/webp'
}

export interface GenerateUploadUrlResult {
  uploadUrl: string
  publicUrl: string
}

export interface StorageRepository {
  generateUploadUrl(input: GenerateUploadUrlInput): Promise<GenerateUploadUrlResult>
}
