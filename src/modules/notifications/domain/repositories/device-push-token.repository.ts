import { DevicePushTokensSelect } from '../../application/schemas'

export interface UpsertDevicePushTokenInput {
  userId: string
  token: string
  platform: string
  deviceId?: string
  appBuild?: string
  permissionStatus: string
}

export interface DevicePushTokenRepository {
  upsert(input: UpsertDevicePushTokenInput): Promise<DevicePushTokensSelect>
  findActiveByUserIds(userIds: string[]): Promise<DevicePushTokensSelect[]>
  deactivateByToken(token: string, userId: string): Promise<void>
  deactivateManyByTokens(tokens: string[]): Promise<void>
}
