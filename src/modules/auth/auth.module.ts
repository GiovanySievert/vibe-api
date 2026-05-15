import { CheckUsernameAvailability } from './application/use-cases/check-username-availability'
import { GenerateUniqueUsername } from './application/use-cases/generate-unique-username'
import { UpdateUsername } from './application/use-cases/update-username'
import { DrizzleUserRepository } from './infrastructure/persistence/user-repository.drizzle'

export class AuthModule {
  public readonly checkUsernameAvailability: CheckUsernameAvailability
  public readonly updateUsername: UpdateUsername
  public readonly generateUniqueUsername: GenerateUniqueUsername

  constructor() {
    const userRepo = new DrizzleUserRepository()

    this.checkUsernameAvailability = new CheckUsernameAvailability(userRepo)
    this.updateUsername = new UpdateUsername(userRepo)
    this.generateUniqueUsername = new GenerateUniqueUsername(userRepo)
  }
}
