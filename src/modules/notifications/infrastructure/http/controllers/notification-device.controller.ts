import { User } from 'better-auth/types'
import { RegisterDevicePushToken } from '../../../application/use-cases/register-device-push-token'
import { UnregisterDevicePushToken } from '../../../application/use-cases/unregister-device-push-token'

export class NotificationDeviceController {
  constructor(
    private readonly registerDevicePushToken: RegisterDevicePushToken,
    private readonly unregisterDevicePushToken: UnregisterDevicePushToken
  ) {}

  async register({
    body,
    user
  }: {
    body: {
      token: string
      platform: string
      deviceId?: string
      appBuild?: string
      permissionStatus: string
    }
    user: User
  }) {
    return await this.registerDevicePushToken.execute({
      userId: user.id,
      token: body.token,
      platform: body.platform,
      deviceId: body.deviceId,
      appBuild: body.appBuild,
      permissionStatus: body.permissionStatus
    })
  }

  async unregister({
    body,
    user
  }: {
    body: {
      token: string
    }
    user: User
  }) {
    await this.unregisterDevicePushToken.execute(user.id, body.token)
  }
}
