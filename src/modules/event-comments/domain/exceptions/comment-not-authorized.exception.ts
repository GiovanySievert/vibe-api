export class CommentNotAuthorizedException extends Error {
  constructor() {
    super('You are not authorized to delete this comment')
    this.name = 'CommentNotAuthorizedException'
  }
}
