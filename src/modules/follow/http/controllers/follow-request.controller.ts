import { User } from 'better-auth/types'
import { CreateFollowRequest, UpdateFollowRequest, ListFollowRequest } from '../../application/queries'
import { appLogger } from '@src/config/logger'

export class FollowRequestController {
  constructor(
    private readonly createFollowRequest: CreateFollowRequest,
    private readonly updateFollowRequest: UpdateFollowRequest,
    private readonly listFollowRequest: ListFollowRequest
  ) {}

  async create({ params, user }: { params: { requestedId: string }; user: User }) {
    try {
      return await this.createFollowRequest.execute({
        requesterId: user.id,
        requestedId: params.requestedId
      })
    } catch (error) {
      appLogger.error('Failed to create follow request', {
        requesterId: user.id,
        requestedId: params.requestedId,
        error
      })
      throw error
    }
  }

  async update({ params, body }: { params: { requestFollowId: string }; body: { status: string } }) {
    try {
      return await this.updateFollowRequest.execute(params.requestFollowId, body)
    } catch (error) {
      appLogger.error('Failed to update follow request', {
        requestFollowId: params.requestFollowId,
        status: body.status,
        error
      })
      throw error
    }
  }

  async list({ user }: { user: User }) {
    try {
      appLogger.info('Listing follow requests', {
        userId: user.id,
        username: user.email,
        action: 'list_follow_requests'
      })
      return await this.listFollowRequest.execute(user.id)
    } catch (error) {
      appLogger.error('Failed to list follow requests', {
        userId: user.id,
        error
      })
      throw error
    }
  }
}
