import { CheckUsernameAvailability } from './application/use-cases/check-username-availability'
import { DrizzleUserRepository } from './infrastructure/persistence/user-repository.drizzle'

export class AuthModule {
  public readonly checkUsernameAvailability: CheckUsernameAvailability

  constructor() {
    const userRepo = new DrizzleUserRepository()

    this.checkUsernameAvailability = new CheckUsernameAvailability(userRepo)
  }
}
