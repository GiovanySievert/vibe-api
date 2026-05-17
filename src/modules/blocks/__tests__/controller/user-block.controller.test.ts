import { beforeEach, describe, expect, it } from 'bun:test'
import { User } from 'better-auth/types'

import { UserBlockController } from '../../infrastructure/http/controllers/user-block.controller'

const makeUser = (id: string): User => ({ id, name: `user-${id}`, email: `${id}@example.com` }) as User

describe('UserBlockController', () => {
  let blockCalls: Array<{ blockerId: string; blockedId: string }>
  let unblockCalls: Array<{ blockerId: string; blockedId: string }>
  let checkCalls: Array<{ a: string; b: string }>
  let listCalls: Array<{ userId: string; page?: number; limit?: number }>
  let checkResult: boolean
  let controller: UserBlockController

  beforeEach(() => {
    blockCalls = []
    unblockCalls = []
    checkCalls = []
    listCalls = []
    checkResult = false

    controller = new UserBlockController(
      {
        async execute(blockerId: string, blockedId: string) {
          blockCalls.push({ blockerId, blockedId })
          return { blockerId, blockedId, createdAt: new Date('2026-01-01T00:00:00Z') }
        }
      } as never,
      {
        async execute(blockerId: string, blockedId: string) {
          unblockCalls.push({ blockerId, blockedId })
        }
      } as never,
      {
        async execute(a: string, b: string) {
          checkCalls.push({ a, b })
          return checkResult
        }
      } as never,
      {
        async execute(userId: string, page?: number, limit?: number) {
          listCalls.push({ userId, page, limit })
          return {
            data: [{ id: 'b-1', userId: 'blocked-1', username: 'foo', avatar: null }],
            total: 1,
            hasMore: false
          }
        }
      } as never
    )
  })

  it('returns the raw block use-case result on block (no wrapping)', async () => {
    const result = await controller.block({
      params: { userId: 'blocked-1' },
      user: makeUser('blocker-1')
    })

    expect(blockCalls).toEqual([{ blockerId: 'blocker-1', blockedId: 'blocked-1' }])
    expect(result).toEqual({
      blockerId: 'blocker-1',
      blockedId: 'blocked-1',
      createdAt: new Date('2026-01-01T00:00:00Z')
    })
  })

  it('returns {success: true} on unblock regardless of use-case return', async () => {
    const result = await controller.unblock({
      params: { userId: 'blocked-1' },
      user: makeUser('blocker-1')
    })

    expect(unblockCalls).toEqual([{ blockerId: 'blocker-1', blockedId: 'blocked-1' }])
    expect(result).toEqual({ success: true })
  })

  it('wraps boolean from CheckBlockStatus into {isBlocked: true}', async () => {
    checkResult = true
    const result = await controller.checkStatus({
      params: { userId: 'other-1' },
      user: makeUser('viewer-1')
    })

    expect(checkCalls).toEqual([{ a: 'viewer-1', b: 'other-1' }])
    expect(result).toEqual({ isBlocked: true })
  })

  it('wraps false from CheckBlockStatus into {isBlocked: false}', async () => {
    checkResult = false
    const result = await controller.checkStatus({
      params: { userId: 'other-1' },
      user: makeUser('viewer-1')
    })

    expect(result).toEqual({ isBlocked: false })
  })

  it('returns the unwrapped pagination object from list', async () => {
    const result = await controller.list({
      user: makeUser('viewer-1'),
      query: { page: 2, limit: 25 }
    })

    expect(listCalls).toEqual([{ userId: 'viewer-1', page: 2, limit: 25 }])
    expect(result).toEqual({
      data: [{ id: 'b-1', userId: 'blocked-1', username: 'foo', avatar: null }],
      total: 1,
      hasMore: false
    })
  })

  it('passes undefined page/limit when query omits them', async () => {
    await controller.list({
      user: makeUser('viewer-1'),
      query: {}
    })

    expect(listCalls[0]).toEqual({ userId: 'viewer-1', page: undefined, limit: undefined })
  })

  it('does not wrap the block response with {success}', async () => {
    const result = await controller.block({
      params: { userId: 'blocked-1' },
      user: makeUser('blocker-1')
    })
    expect('success' in result).toBe(false)
  })

  it('does not wrap the list response with {success} or {isBlocked}', async () => {
    const result = await controller.list({
      user: makeUser('viewer-1'),
      query: {}
    })
    expect('success' in result).toBe(false)
    expect('isBlocked' in result).toBe(false)
    expect('data' in result).toBe(true)
  })
})
