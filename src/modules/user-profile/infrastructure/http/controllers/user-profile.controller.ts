import { User } from 'better-auth/types'
import { UpdateUserProfile } from '../../../application/use-cases'

export class UserProfileController {
  constructor(private readonly updateUserProfile: UpdateUserProfile) {}

  async update({ body, user }: { body: { name: string; bio?: string; image?: string }; user: User }) {
    return await this.updateUserProfile.execute(user.id, {
      name: body.name,
      bio: body.bio ?? null,
      image: body.image ?? null
    })
  }
}
