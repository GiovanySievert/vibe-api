import { db } from '@src/infra/database/client'
import { and, eq, inArray } from 'drizzle-orm'
import { devicePushTokens, DevicePushTokensSelect } from '../../application/schemas'
import { DevicePushTokenRepository, UpsertDevicePushTokenInput } from '../../domain/repositories/device-push-token.repository'

export class DrizzleDevicePushTokenRepository implements DevicePushTokenRepository {
  async upsert(input: UpsertDevicePushTokenInput): Promise<DevicePushTokensSelect> {
    const [devicePushToken] = await db
      .insert(devicePushTokens)
      .values({
        userId: input.userId,
        token: input.token,
        platform: input.platform,
        deviceId: input.deviceId,
        appBuild: input.appBuild,
        permissionStatus: input.permissionStatus,
        isActive: true,
        lastSeenAt: new Date(),
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: devicePushTokens.token,
        set: {
          userId: input.userId,
          platform: input.platform,
          deviceId: input.deviceId,
          appBuild: input.appBuild,
          permissionStatus: input.permissionStatus,
          isActive: true,
          lastSeenAt: new Date(),
          updatedAt: new Date()
        }
      })
      .returning()

    return devicePushToken
  }

  async findActiveByUserIds(userIds: string[]): Promise<DevicePushTokensSelect[]> {
    if (userIds.length === 0) {
      return []
    }

    return await db
      .select()
      .from(devicePushTokens)
      .where(and(inArray(devicePushTokens.userId, userIds), eq(devicePushTokens.isActive, true)))
  }

  async deactivateByToken(token: string, userId: string): Promise<void> {
    await db
      .update(devicePushTokens)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(and(eq(devicePushTokens.token, token), eq(devicePushTokens.userId, userId)))
  }

  async deactivateManyByTokens(tokens: string[]): Promise<void> {
    if (tokens.length === 0) {
      return
    }

    await db
      .update(devicePushTokens)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(inArray(devicePushTokens.token, tokens))
  }
}
