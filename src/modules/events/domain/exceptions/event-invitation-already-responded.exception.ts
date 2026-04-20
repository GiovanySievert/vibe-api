export class EventInvitationAlreadyRespondedException extends Error {
  constructor() {
    super('This event invitation has already been responded to')
    this.name = 'EventInvitationAlreadyRespondedException'
  }
}
