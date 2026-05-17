export class InvalidStorageFolderException extends Error {
  constructor(folder: string) {
    super(`Storage folder "${folder}" is invalid.`)
    this.name = 'InvalidStorageFolderException'
  }
}
