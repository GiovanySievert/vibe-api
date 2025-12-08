import { User } from 'better-auth/types'
import {
  CreateFollowRequest,
  ListFollowRequest,
  AcceptFollowRequest,
  RejectFollowRequest,
  CancelFollowRequest,
  ListRequestedFollowRequest
} from '../../../application/use-cases'

export class FollowRequestController {
  constructor(
    private readonly createFollowRequest: CreateFollowRequest,
    private readonly listFollowRequest: ListFollowRequest,
    private readonly listRequestedFollowRequest: ListRequestedFollowRequest,
    private readonly acceptFollowRequest: AcceptFollowRequest,
    private readonly rejectFollowRequest: RejectFollowRequest,
    private readonly cancelFollowRequest: CancelFollowRequest
  ) {}

  async create({ params, user }: { params: { userId: string }; user: User }) {
    return await this.createFollowRequest.execute({
      requesterId: user.id,
      requestedId: params.userId
    })
  }

  async list({ user }: { user: User }) {
    return await this.listFollowRequest.execute(user.id)
  }

  async listRequested({ user }: { user: User }) {
    return await this.listRequestedFollowRequest.execute(user.id)
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
