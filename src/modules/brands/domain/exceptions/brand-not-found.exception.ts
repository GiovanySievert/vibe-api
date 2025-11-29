export class BrandNotFoundException extends Error {
  constructor(public readonly brandId: string) {
    super(`Brand with ID ${brandId} not found`)
    this.name = 'BrandNotFoundException'
  }
}
