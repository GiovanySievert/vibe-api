export class EventNotOwnerException extends Error {
  constructor() {
    super('Only the event owner can perform this action')
    this.name = 'EventNotOwnerException'
  }
}
