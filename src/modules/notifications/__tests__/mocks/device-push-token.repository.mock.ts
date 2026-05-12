import { randomUUID } from 'crypto'

import { DevicePushTokensSelect } from '../../application/schemas'
import {
  DevicePushTokenRepository,
  UpsertDevicePushTokenInput
} from '../../domain/repositories/device-push-token.repository'

export class MockDevicePushTokenRepository implements DevicePushTokenRepository {
  public rows: DevicePushTokensSelect[] = []
  public upsertCalls: UpsertDevicePushTokenInput[] = []
  public deactivateByTokenCalls: { token: string; userId: string }[] = []
  public deactivateManyByTokensCalls: string[][] = []

  async upsert(input: UpsertDevicePushTokenInput): Promise<DevicePushTokensSelect> {
    this.upsertCalls.push(input)
    const existing = this.rows.find((row) => row.token === input.token)
    const now = new Date()
    if (existing) {
      existing.userId = input.userId
      existing.platform = input.platform
      existing.deviceId = input.deviceId ?? existing.deviceId
      existing.appBuild = input.appBuild ?? existing.appBuild
      existing.permissionStatus = input.permissionStatus
      existing.isActive = true
      existing.lastSeenAt = now
      existing.updatedAt = now
      return existing
    }
    const row: DevicePushTokensSelect = {
      id: randomUUID(),
      userId: input.userId,
      token: input.token,
      platform: input.platform,
      deviceId: input.deviceId ?? null,
      appBuild: input.appBuild ?? null,
      permissionStatus: input.permissionStatus,
      isActive: true,
      lastSeenAt: now,
      createdAt: now,
      updatedAt: now
    }
    this.rows.push(row)
    return row
  }

  async findActiveByUserIds(userIds: string[]): Promise<DevicePushTokensSelect[]> {
    return this.rows.filter((row) => row.isActive && userIds.includes(row.userId))
  }

  async deactivateByToken(token: string, userId: string): Promise<void> {
    this.deactivateByTokenCalls.push({ token, userId })
    const row = this.rows.find((item) => item.token === token && item.userId === userId)
    if (row) {
      row.isActive = false
    }
  }

  async deactivateManyByTokens(tokens: string[]): Promise<void> {
    this.deactivateManyByTokensCalls.push([...tokens])
    for (const row of this.rows) {
      if (tokens.includes(row.token)) {
        row.isActive = false
      }
    }
  }
}
