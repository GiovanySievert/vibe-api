export class UnsupportedContentTypeException extends Error {
  constructor(contentType: string) {
    super(`Content type "${contentType}" not supported. Use image/jpeg, image/png, or image/webp.`)
    this.name = 'UnsupportedContentTypeException'
  }
}
