import { User } from 'better-auth/types'
import {
  BlockUserWithCleanup,
  UnblockUser,
  CheckBlockStatus,
  ListBlockedUsers
} from '../../../application/use-cases'

export class UserBlockController {
  constructor(
    private readonly blockUserWithCleanup: BlockUserWithCleanup,
    private readonly unblockUser: UnblockUser,
    private readonly checkBlockStatus: CheckBlockStatus,
    private readonly listBlockedUsers: ListBlockedUsers
  ) {}

  async block({ params, user }: { params: { userId: string }; user: User }) {
    return await this.blockUserWithCleanup.execute(user.id, params.userId)
  }

  async unblock({ params, user }: { params: { userId: string }; user: User }) {
    await this.unblockUser.execute(user.id, params.userId)
    return { success: true }
  }

  async checkStatus({ params, user }: { params: { userId: string }; user: User }) {
    const isBlocked = await this.checkBlockStatus.execute(user.id, params.userId)
    return { isBlocked }
  }

  async list({ user }: { user: User }) {
    return await this.listBlockedUsers.execute(user.id)
  }
}
