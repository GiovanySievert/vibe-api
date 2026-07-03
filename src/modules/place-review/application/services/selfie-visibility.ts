import { FollowChecker } from '@src/modules/place-review/domain/repositories'

type SelfieVisibilityRow = {
  userId: string
  selfieUrl: string | null
  selfieThumbnailUrl: string | null
  selfieFriendsOnly: boolean
}

export async function applySelfieVisibility<T extends SelfieVisibilityRow>(
  rows: T[],
  viewerId: string,
  followChecker: FollowChecker
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

  const followedUserIds = await followChecker.getFollowedUserIds(viewerId, authorIds)

  return rows.map((row) => {
    if (!row.selfieFriendsOnly || row.userId === viewerId || !row.selfieUrl || followedUserIds.has(row.userId)) {
      return row
    }
    return { ...row, selfieUrl: null, selfieThumbnailUrl: null }
  })
}
