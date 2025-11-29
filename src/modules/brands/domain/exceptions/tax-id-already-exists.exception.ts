export class TaxIdAlreadyExistsException extends Error {
  constructor(public readonly taxId: string) {
    super(`Brand with tax ID ${taxId} already exists`)
    this.name = 'TaxIdAlreadyExistsException'
  }
}
