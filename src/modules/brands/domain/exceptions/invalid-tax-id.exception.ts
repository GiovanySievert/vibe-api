export class InvalidTaxIdException extends Error {
  constructor(public readonly taxId: string, public readonly reason?: string) {
    super(reason ? `Invalid tax ID ${taxId}: ${reason}` : `Invalid tax ID ${taxId}`)
    this.name = 'InvalidTaxIdException'
  }
}
