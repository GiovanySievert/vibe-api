import { User } from 'better-auth/types'
import { CreateFollowRequest, UpdateFollowRequest, ListFollowRequest } from '../../application/queries'

export class FollowRequestController {
  constructor(
    private readonly createFollowRequest: CreateFollowRequest,
    private readonly updateFollowRequest: UpdateFollowRequest,
    private readonly listFollowRequest: ListFollowRequest
  ) {}

  async create({ params, user }: { params: { requestedId: string }; user: User }) {
    return await this.createFollowRequest.execute({
      requesterId: user.id,
      requestedId: params.requestedId
    })
  }

  async update({ params, body }: { params: { requestFollowId: string }; body: { status: string } }) {
    return await this.updateFollowRequest.execute(params.requestFollowId, body)
  }

  async list({ user }: { user: User }) {
    return await this.listFollowRequest.execute(user.id)
  }
}
