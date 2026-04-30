export class UserAlreadyReportedException extends Error {
  constructor() {
    super('You have already reported this user')
    this.name = 'UserAlreadyReportedException'
  }
}
