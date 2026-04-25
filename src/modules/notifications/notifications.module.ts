import { ApplicationEventBus } from '@src/shared/application/events'
import { EmailSender } from './application/ports/email-sender'
import { PushSender } from './application/ports/push-sender'
import {
  SendEventInvitationPushHandler,
  SendFollowRequestPushHandler
} from './application/event-handlers'
import { RegisterDevicePushToken } from './application/use-cases/register-device-push-token'
import { SendPushNotification } from './application/use-cases/send-push-notification'
import { UnregisterDevicePushToken } from './application/use-cases/unregister-device-push-token'
import { env } from '@src/config/env'
import { EVENT_CREATED_EVENT } from '@src/modules/events/application/events/event-created.event'
import { FOLLOW_REQUEST_CREATED_EVENT } from '@src/modules/follow/application/events/follow-request-created.event'
import { ResendEmailSender } from './infrastructure/email/resend-email-sender'
import { NotificationDeviceController } from './infrastructure/http/controllers/notification-device.controller'
import { DrizzleDevicePushTokenRepository } from './infrastructure/persistence/device-push-token.repository.drizzle'
import { ExpoPushSender } from './infrastructure/push/expo-push-sender'

export class NotificationsModule {
  public readonly emailSender: EmailSender
  public readonly pushSender: PushSender
  public readonly notificationDeviceController: NotificationDeviceController
  public readonly sendPushNotification: SendPushNotification
  private readonly sendEventInvitationPushHandler: SendEventInvitationPushHandler
  private readonly sendFollowRequestPushHandler: SendFollowRequestPushHandler

  constructor(
    apiKey: string = env.RESEND_API_KEY,
    from: string = env.RESEND_FROM_EMAIL,
    expoPushAccessToken: string | undefined = env.EXPO_PUSH_ACCESS_TOKEN
  ) {
    const devicePushTokenRepository = new DrizzleDevicePushTokenRepository()
    const registerDevicePushToken = new RegisterDevicePushToken(devicePushTokenRepository)
    const unregisterDevicePushToken = new UnregisterDevicePushToken(devicePushTokenRepository)

    this.emailSender = new ResendEmailSender(apiKey, from)
    this.pushSender = new ExpoPushSender(expoPushAccessToken)
    this.notificationDeviceController = new NotificationDeviceController(
      registerDevicePushToken,
      unregisterDevicePushToken
    )
    this.sendPushNotification = new SendPushNotification(devicePushTokenRepository, this.pushSender)
    this.sendEventInvitationPushHandler = new SendEventInvitationPushHandler(this.sendPushNotification)
    this.sendFollowRequestPushHandler = new SendFollowRequestPushHandler(this.sendPushNotification)
  }

  registerEventHandlers(applicationEventBus: ApplicationEventBus) {
    applicationEventBus.subscribe(
      EVENT_CREATED_EVENT,
      this.sendEventInvitationPushHandler,
      'notifications.send-event-invitation-push'
    )
    applicationEventBus.subscribe(
      FOLLOW_REQUEST_CREATED_EVENT,
      this.sendFollowRequestPushHandler,
      'notifications.send-follow-request-push'
    )
  }
}
