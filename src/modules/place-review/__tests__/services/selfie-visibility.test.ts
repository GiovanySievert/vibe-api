import { describe, it, expect, beforeEach, mock } from 'bun:test'

import { applySelfieVisibility } from '../../application/services/selfie-visibility'
import { MockFollowChecker } from '../mocks/follow-checker.mock'

type Row = {
  userId: string
  selfieUrl: string | null
  selfieThumbnailUrl: string | null
  selfieFriendsOnly: boolean
  tag: string
}

const row = (data: Omit<Row, 'selfieThumbnailUrl'> & { selfieThumbnailUrl?: string | null }): Row => ({
  selfieThumbnailUrl: data.selfieUrl ? data.selfieThumbnailUrl ?? data.selfieUrl.replace('.jpg', '-thumb.jpg') : null,
  ...data
})

describe('applySelfieVisibility', () => {
  let followChecker: MockFollowChecker

  beforeEach(() => {
    followChecker = new MockFollowChecker()
  })

  it('returns the same empty array without touching followChecker', async () => {
    const spy = mock(followChecker.getFollowedUserIds.bind(followChecker))
    followChecker.getFollowedUserIds = spy

    const result = await applySelfieVisibility<Row>([], 'viewer-1', followChecker)

    expect(result).toEqual([])
    expect(spy).not.toHaveBeenCalled()
  })

  it('keeps rows unchanged when no row is friendsOnly', async () => {
    const spy = mock(followChecker.getFollowedUserIds.bind(followChecker))
    followChecker.getFollowedUserIds = spy
    const rows: Row[] = [
      row({ userId: 'user-1', selfieUrl: 'http://x/1.jpg', selfieFriendsOnly: false, tag: 'a' }),
      row({ userId: 'user-2', selfieUrl: null, selfieFriendsOnly: false, tag: 'b' })
    ]

    const result = await applySelfieVisibility(rows, 'viewer-1', followChecker)

    expect(result).toEqual(rows)
    expect(spy).not.toHaveBeenCalled()
  })

  it('keeps the selfie when the viewer is the author', async () => {
    const rows: Row[] = [
      row({ userId: 'viewer-1', selfieUrl: 'http://x/self.jpg', selfieFriendsOnly: true, tag: 'a' })
    ]

    const result = await applySelfieVisibility(rows, 'viewer-1', followChecker)

    expect(result[0].selfieUrl).toBe('http://x/self.jpg')
    expect(result[0].selfieThumbnailUrl).toBe('http://x/self-thumb.jpg')
  })

  it('keeps the selfie when the viewer follows the author (one-way)', async () => {
    followChecker.addFollow('viewer-1', 'user-1')
    const rows: Row[] = [
      row({ userId: 'user-1', selfieUrl: 'http://x/1.jpg', selfieFriendsOnly: true, tag: 'a' })
    ]

    const result = await applySelfieVisibility(rows, 'viewer-1', followChecker)

    expect(result[0].selfieUrl).toBe('http://x/1.jpg')
    expect(result[0].selfieThumbnailUrl).toBe('http://x/1-thumb.jpg')
  })

  it('nulls the selfie when the viewer does not follow the author (even if the author follows viewer)', async () => {
    followChecker.addFollow('user-1', 'viewer-1')
    const rows: Row[] = [
      row({ userId: 'user-1', selfieUrl: 'http://x/1.jpg', selfieFriendsOnly: true, tag: 'a' })
    ]

    const result = await applySelfieVisibility(rows, 'viewer-1', followChecker)

    expect(result[0].selfieUrl).toBeNull()
    expect(result[0].selfieThumbnailUrl).toBeNull()
  })

  it('resolves each row independently in a mixed list and calls followChecker once with the unique author set', async () => {
    followChecker.addFollow('viewer-1', 'user-1')
    const spy = mock(followChecker.getFollowedUserIds.bind(followChecker))
    followChecker.getFollowedUserIds = spy
    const rows: Row[] = [
      row({ userId: 'user-1', selfieUrl: 'http://x/1.jpg', selfieFriendsOnly: true, tag: 'followed-friendsOnly' }),
      row({ userId: 'user-1', selfieUrl: 'http://x/1b.jpg', selfieFriendsOnly: true, tag: 'duplicate-author' }),
      row({ userId: 'user-2', selfieUrl: 'http://x/2.jpg', selfieFriendsOnly: true, tag: 'not-followed-friendsOnly' }),
      row({ userId: 'user-3', selfieUrl: 'http://x/3.jpg', selfieFriendsOnly: false, tag: 'public' }),
      row({ userId: 'viewer-1', selfieUrl: 'http://x/self.jpg', selfieFriendsOnly: true, tag: 'self' })
    ]

    const result = await applySelfieVisibility(rows, 'viewer-1', followChecker)

    expect(result.find((r) => r.tag === 'followed-friendsOnly')?.selfieUrl).toBe('http://x/1.jpg')
    expect(result.find((r) => r.tag === 'duplicate-author')?.selfieUrl).toBe('http://x/1b.jpg')
    expect(result.find((r) => r.tag === 'not-followed-friendsOnly')?.selfieUrl).toBeNull()
    expect(result.find((r) => r.tag === 'not-followed-friendsOnly')?.selfieThumbnailUrl).toBeNull()
    expect(result.find((r) => r.tag === 'public')?.selfieUrl).toBe('http://x/3.jpg')
    expect(result.find((r) => r.tag === 'self')?.selfieUrl).toBe('http://x/self.jpg')

    expect(spy).toHaveBeenCalledTimes(1)
    const [, candidateIds] = spy.mock.calls[0]
    expect(new Set(candidateIds)).toEqual(new Set(['user-1', 'user-2']))
  })
})
