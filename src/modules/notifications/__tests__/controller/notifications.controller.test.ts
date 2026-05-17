import { beforeEach, describe, expect, it } from 'bun:test'
import { User } from 'better-auth/types'

import { NotificationsController } from '../../infrastructure/http/controllers/notifications.controller'

const makeUser = (id: string): User => ({ id, name: `user-${id}`, email: `${id}@example.com` }) as User

describe('NotificationsController', () => {
  let listCalls: any[]
  let countCalls: string[]
  let markReadCalls: Array<{ userId: string; id: string }>
  let markAllCalls: string[]
  let preferencesCalls: string[]
  let updatePreferenceCalls: any[]
  let controller: NotificationsController

  beforeEach(() => {
    listCalls = []
    countCalls = []
    markReadCalls = []
    markAllCalls = []
    preferencesCalls = []
    updatePreferenceCalls = []

    controller = new NotificationsController(
      {
        async execute(input: any) {
          listCalls.push(input)
          return { items: [], nextCursor: null }
        }
      } as never,
      {
        async execute(userId: string) {
          countCalls.push(userId)
          return 7
        }
      } as never,
      {
        async execute(userId: string, id: string) {
          markReadCalls.push({ userId, id })
          return { success: true }
        }
      } as never,
      {
        async execute(userId: string) {
          markAllCalls.push(userId)
          return { updated: 3 }
        }
      } as never,
      {
        async execute(userId: string) {
          preferencesCalls.push(userId)
          return [{ type: 'follow', pushEnabled: true, inAppEnabled: true }]
        }
      } as never,
      {
        async execute(input: any) {
          updatePreferenceCalls.push(input)
          return { type: input.type, pushEnabled: input.pushEnabled, inAppEnabled: input.inAppEnabled }
        }
      } as never
    )
  })

  it('coerces numeric limit string and passes it through', async () => {
    await controller.list({
      query: { limit: '25', cursor: 'abc', unreadOnly: 'true' },
      user: makeUser('u-1')
    })

    expect(listCalls).toHaveLength(1)
    expect(listCalls[0]).toEqual({
      userId: 'u-1',
      limit: 25,
      cursor: 'abc',
      unreadOnly: true
    })
  })

  it('passes undefined limit when query.limit is absent', async () => {
    await controller.list({
      query: {},
      user: makeUser('u-1')
    })

    expect(listCalls[0].limit).toBeUndefined()
    expect(listCalls[0].unreadOnly).toBe(false)
    expect(listCalls[0].cursor).toBeUndefined()
  })

  it('converts non-numeric limit to undefined via Number.isFinite check', async () => {
    await controller.list({
      query: { limit: 'abc' },
      user: makeUser('u-1')
    })

    expect(listCalls[0].limit).toBeUndefined()
  })

  it('coerces unreadOnly=true string to true boolean', async () => {
    await controller.list({
      query: { unreadOnly: 'true' },
      user: makeUser('u-1')
    })
    expect(listCalls[0].unreadOnly).toBe(true)
  })

  it('coerces unreadOnly=false string to false boolean', async () => {
    await controller.list({
      query: { unreadOnly: 'false' },
      user: makeUser('u-1')
    })
    expect(listCalls[0].unreadOnly).toBe(false)
  })

  it('coerces any non-"true" unreadOnly value to false', async () => {
    await controller.list({
      query: { unreadOnly: '1' },
      user: makeUser('u-1')
    })
    expect(listCalls[0].unreadOnly).toBe(false)
  })

  it('returns the unread count from the use case', async () => {
    const result = await controller.unreadCount({ user: makeUser('u-9') })
    expect(countCalls).toEqual(['u-9'])
    expect(result).toBe(7)
  })

  it('marks a single notification as read using params id', async () => {
    const result = await controller.markAsRead({ params: { id: 'notif-1' }, user: makeUser('u-2') })
    expect(markReadCalls).toEqual([{ userId: 'u-2', id: 'notif-1' }])
    expect(result).toEqual({ success: true })
  })

  it('marks all as read for the authenticated user', async () => {
    const result = await controller.markAllAsRead({ user: makeUser('u-3') })
    expect(markAllCalls).toEqual(['u-3'])
    expect(result).toEqual({ updated: 3 })
  })

  it('returns preferences for the authenticated user', async () => {
    const result = await controller.preferences({ user: makeUser('u-4') })
    expect(preferencesCalls).toEqual(['u-4'])
    expect(result).toEqual([{ type: 'follow', pushEnabled: true, inAppEnabled: true }])
  })

  it('updates a notification preference forwarding type from params', async () => {
    const result = await controller.updatePreference({
      params: { type: 'follow' },
      body: { pushEnabled: false, inAppEnabled: true },
      user: makeUser('u-5')
    })

    expect(updatePreferenceCalls).toHaveLength(1)
    expect(updatePreferenceCalls[0]).toEqual({
      userId: 'u-5',
      type: 'follow',
      pushEnabled: false,
      inAppEnabled: true
    })
    expect(result).toEqual({ type: 'follow', pushEnabled: false, inAppEnabled: true })
  })

  it('allows partial preference body (only pushEnabled)', async () => {
    await controller.updatePreference({
      params: { type: 'comment' },
      body: { pushEnabled: true },
      user: makeUser('u-6')
    })

    expect(updatePreferenceCalls[0]).toEqual({
      userId: 'u-6',
      type: 'comment',
      pushEnabled: true,
      inAppEnabled: undefined
    })
  })
})
