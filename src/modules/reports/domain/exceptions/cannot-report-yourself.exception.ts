export class CannotReportYourselfException extends Error {
  constructor() {
    super('You cannot report yourself')
    this.name = 'CannotReportYourselfException'
  }
}
