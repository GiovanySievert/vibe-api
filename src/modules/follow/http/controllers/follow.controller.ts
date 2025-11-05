import { Session } from 'better-auth/types'

export class FollowController {
  constructor() {}

  async list({ session }: { session: Session }) {}
  async create({ params, session }: { params: { placeId: string }; session: Session }) {}
}
