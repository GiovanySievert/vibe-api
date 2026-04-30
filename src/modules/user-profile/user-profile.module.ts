import { UpdateUserProfile } from './application/use-cases'
import { DrizzleUserProfileRepository } from './infrastructure/persistence'
import { UserProfileController } from './infrastructure/http/controllers'

export class UserProfileModule {
  public readonly userProfileController: UserProfileController

  constructor() {
    const userProfileRepo = new DrizzleUserProfileRepository()
    const updateUserProfileService = new UpdateUserProfile(userProfileRepo)

    this.userProfileController = new UserProfileController(updateUserProfileService)
  }
}
