import { UserProfileBadge } from '../../domain/mappers'
import { ReplaceUserProfileBadgesInput, UserProfileBadgesRepository } from '../../domain/repositories'

export class MockUserProfileBadgesRepository implements UserProfileBadgesRepository {
  private profileBadgeSelections: UserProfileBadge[] = []

  async listByUser(userId: string): Promise<UserProfileBadge[]> {
    return this.profileBadgeSelections
      .filter((profileBadgeSelection) => profileBadgeSelection.userId === userId)
      .sort((a, b) => a.position - b.position)
      .map((profileBadgeSelection) => ({ ...profileBadgeSelection }))
  }

  async replaceForUser(input: ReplaceUserProfileBadgesInput): Promise<UserProfileBadge[]> {
    this.profileBadgeSelections = this.profileBadgeSelections.filter(
      (profileBadgeSelection) => profileBadgeSelection.userId !== input.userId
    )
    const selectedAt = new Date()
    const profileBadgeSelections = input.placeIds.map((placeId, index) => ({
      userId: input.userId,
      placeId,
      position: index + 1,
      selectedAt
    }))
    this.profileBadgeSelections.push(...profileBadgeSelections)
    return profileBadgeSelections.map((profileBadgeSelection) => ({ ...profileBadgeSelection }))
  }

  async removeByUserAndPlace(userId: string, placeId: string): Promise<void> {
    const currentProfileBadgeSelections = await this.listByUser(userId)
    await this.replaceForUser({
      userId,
      placeIds: currentProfileBadgeSelections
        .filter((profileBadgeSelection) => profileBadgeSelection.placeId !== placeId)
        .map((profileBadgeSelection) => profileBadgeSelection.placeId)
    })
  }

  seed(profileBadgeSelections: UserProfileBadge[]) {
    this.profileBadgeSelections = profileBadgeSelections.map((profileBadgeSelection) => ({ ...profileBadgeSelection }))
  }
}
