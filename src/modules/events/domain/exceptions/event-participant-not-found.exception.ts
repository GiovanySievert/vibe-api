export class EventParticipantNotFoundException extends Error {
  constructor() {
    super('Event participant not found')
    this.name = 'EventParticipantNotFoundException'
  }
}
