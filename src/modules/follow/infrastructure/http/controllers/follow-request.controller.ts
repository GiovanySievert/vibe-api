import { User } from 'better-auth/types'
import {
  CreateFollowRequest,
  UpdateFollowRequest,
  ListFollowRequest,
  AcceptFollowRequest,
  RejectFollowRequest,
  CancelFollowRequest
} from '../../../application/use-cases'

export class FollowRequestController {
  constructor(
    private readonly createFollowRequest: CreateFollowRequest,
    private readonly updateFollowRequest: UpdateFollowRequest,
    private readonly listFollowRequest: ListFollowRequest,
    private readonly acceptFollowRequest: AcceptFollowRequest,
    private readonly rejectFollowRequest: RejectFollowRequest,
    private readonly cancelFollowRequest: CancelFollowRequest
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

  async accept({ params }: { params: { requestFollowId: string } }) {
    return await this.acceptFollowRequest.execute(params.requestFollowId)
  }

  async reject({ params }: { params: { requestFollowId: string } }) {
    return await this.rejectFollowRequest.execute(params.requestFollowId)
  }

  async cancel({ params, user }: { params: { requestFollowId: string }; user: User }) {
    return await this.cancelFollowRequest.execute(params.requestFollowId, user.id)
  }
}
