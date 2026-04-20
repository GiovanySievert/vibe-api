export class EventNotFoundException extends Error {
  constructor() {
    super('Event not found')
    this.name = 'EventNotFoundException'
  }
}
