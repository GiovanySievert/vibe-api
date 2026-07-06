import { describe, expect, it } from 'bun:test'

import { applyAnonymity } from '../../application/services/anonymity'

type Row = {
  userId: string | null
  isAnonymous: boolean
  user: {
    id: string
    username: string
    image: string | null
    imageThumbnail: string | null
  } | null
}

const makeUser = (id: string) => ({
  id,
  username: `user-${id}`,
  image: null,
  imageThumbnail: null
})

describe('applyAnonymity', () => {
  it('returns the same empty array', () => {
    const result = applyAnonymity<Row>([], 'viewer-1')
    expect(result).toEqual([])
  })

  it('passes non-anonymous rows through with flags set to false', () => {
    const rows: Row[] = [{ userId: 'user-1', isAnonymous: false, user: makeUser('user-1') }]

    const [row] = applyAnonymity(rows, 'viewer-1')

    expect(row.userId).toBe('user-1')
    expect(row.user).toEqual(makeUser('user-1'))
    expect(row.isAnonymous).toBe(false)
    expect(row.isOwnAnonymous).toBe(false)
  })

  it('strips identity for another viewer and marks isOwnAnonymous false', () => {
    const rows: Row[] = [{ userId: 'user-1', isAnonymous: true, user: makeUser('user-1') }]

    const [row] = applyAnonymity(rows, 'viewer-1')

    expect(row.userId).toBeNull()
    expect(row.user).toBeNull()
    expect(row.isAnonymous).toBe(true)
    expect(row.isOwnAnonymous).toBe(false)
  })

  it('strips identity for the author and marks isOwnAnonymous true', () => {
    const rows: Row[] = [{ userId: 'user-1', isAnonymous: true, user: makeUser('user-1') }]

    const [row] = applyAnonymity(rows, 'user-1')

    expect(row.userId).toBeNull()
    expect(row.user).toBeNull()
    expect(row.isAnonymous).toBe(true)
    expect(row.isOwnAnonymous).toBe(true)
  })

  it('does not leak the real id or username anywhere on an anonymous row', () => {
    const rows: Row[] = [{ userId: 'user-1', isAnonymous: true, user: makeUser('user-1') }]

    const [row] = applyAnonymity(rows, 'user-1')

    expect(JSON.stringify(row)).not.toContain('user-1')
  })

  it('resolves each row independently in a mixed list', () => {
    const rows: Row[] = [
      { userId: 'user-1', isAnonymous: true, user: makeUser('user-1') },
      { userId: 'user-2', isAnonymous: false, user: makeUser('user-2') },
      { userId: 'viewer-1', isAnonymous: true, user: makeUser('viewer-1') }
    ]

    const [anonOther, publicRow, anonOwn] = applyAnonymity(rows, 'viewer-1')

    expect(anonOther.user).toBeNull()
    expect(anonOther.isOwnAnonymous).toBe(false)
    expect(publicRow.user).toEqual(makeUser('user-2'))
    expect(anonOwn.user).toBeNull()
    expect(anonOwn.isOwnAnonymous).toBe(true)
  })
})
