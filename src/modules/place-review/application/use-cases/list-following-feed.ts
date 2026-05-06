import { FollowChecker, PlaceReviewRepository } from '@src/modules/place-review/domain/repositories'
import { FeedReviewItem } from '@src/modules/place-review/domain/types'

export class ListFollowingFeed {
  constructor(
    private readonly placeReviewRepo: PlaceReviewRepository,
    private readonly followChecker: FollowChecker
  ) {}

  async execute(userId: string, page?: number): Promise<FeedReviewItem[]> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const items = await this.placeReviewRepo.listFollowingFeed(userId, since, page)
    return this.applySelfieVisibility(items, userId)
  }

  private async applySelfieVisibility<T extends { userId: string; selfieUrl: string | null; selfieFriendsOnly: boolean }>(
    rows: T[],
    viewerId: string
  ): Promise<T[]> {
    if (rows.length === 0) return rows

    const authorIds = Array.from(
      new Set(
        rows
          .filter((row) => row.selfieFriendsOnly && row.selfieUrl && row.userId !== viewerId)
          .map((row) => row.userId)
      )
    )

    if (authorIds.length === 0) return rows

    const followedUserIds = await this.followChecker.getFollowedUserIds(viewerId, authorIds)

    return rows.map((row) => {
      if (!row.selfieFriendsOnly || row.userId === viewerId || !row.selfieUrl || followedUserIds.has(row.userId)) {
        return row
      }
      return { ...row, selfieUrl: null }
    })
  }
}
