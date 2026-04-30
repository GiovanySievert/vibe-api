import { ApplicationEventBus } from '@src/shared/application/events'
import { env } from '@src/config/env'
import { EVENT_CREATED_EVENT } from '@src/modules/events/application/events/event-created.event'
import { FOLLOW_REQUEST_CREATED_EVENT } from '@src/modules/follow/application/events/follow-request-created.event'

import { EmailSender } from './application/ports/email-sender'
import { NotificationChannel } from './application/ports/notification-channel'
import { PushSender } from './application/ports/push-sender'
import {
  DispatchEventInvitationHandler,
  DispatchFollowRequestHandler
} from './application/event-handlers'
import { CountUnreadNotifications } from './application/use-cases/count-unread-notifications'
import { DispatchNotification } from './application/use-cases/dispatch-notification'
import { GetNotificationPreferences } from './application/use-cases/get-notification-preferences'
import { ListNotifications } from './application/use-cases/list-notifications'
import { MarkAllNotificationsAsRead } from './application/use-cases/mark-all-notifications-as-read'
import { MarkNotificationAsRead } from './application/use-cases/mark-notification-as-read'
import { RegisterDevicePushToken } from './application/use-cases/register-device-push-token'
import { SendPushNotification } from './application/use-cases/send-push-notification'
import { UnregisterDevicePushToken } from './application/use-cases/unregister-device-push-token'
import { UpdateNotificationPreference } from './application/use-cases/update-notification-preference'

import { InAppChannel } from './infrastructure/channels/in-app-channel'
import { PushChannel } from './infrastructure/channels/push-channel'
import { ResendEmailSender } from './infrastructure/email/resend-email-sender'
import { NotificationDeviceController } from './infrastructure/http/controllers/notification-device.controller'
import { NotificationsController } from './infrastructure/http/controllers/notifications.controller'
import { DrizzleAppNotificationRepository } from './infrastructure/persistence/app-notification.repository.drizzle'
import { DrizzleDevicePushTokenRepository } from './infrastructure/persistence/device-push-token.repository.drizzle'
import { DrizzleNotificationPreferencesRepository } from './infrastructure/persistence/notification-preferences.repository.drizzle'
import { ExpoPushSender } from './infrastructure/push/expo-push-sender'

export class NotificationsModule {
  public readonly emailSender: EmailSender
  public readonly pushSender: PushSender
  public readonly notificationDeviceController: NotificationDeviceController
  public readonly notificationsController: NotificationsController
  public readonly sendPushNotification: SendPushNotification
  public readonly dispatchNotification: DispatchNotification
  private readonly dispatchEventInvitationHandler: DispatchEventInvitationHandler
  private readonly dispatchFollowRequestHandler: DispatchFollowRequestHandler

  constructor(
    apiKey: string = env.RESEND_API_KEY,
    from: string = env.RESEND_FROM_EMAIL,
    expoPushAccessToken: string | undefined = env.EXPO_PUSH_ACCESS_TOKEN
  ) {
    const devicePushTokenRepository = new DrizzleDevicePushTokenRepository()
    const appNotificationRepository = new DrizzleAppNotificationRepository()
    const preferencesRepository = new DrizzleNotificationPreferencesRepository()

    const registerDevicePushToken = new RegisterDevicePushToken(devicePushTokenRepository)
    const unregisterDevicePushToken = new UnregisterDevicePushToken(devicePushTokenRepository)

    this.emailSender = new ResendEmailSender(apiKey, from)
    this.pushSender = new ExpoPushSender(expoPushAccessToken)
    this.sendPushNotification = new SendPushNotification(devicePushTokenRepository, this.pushSender)

    const inAppChannel: NotificationChannel = new InAppChannel(appNotificationRepository)
    const pushChannel: NotificationChannel = new PushChannel(this.sendPushNotification)

    this.dispatchNotification = new DispatchNotification(
      preferencesRepository,
      inAppChannel,
      pushChannel
    )

    this.dispatchEventInvitationHandler = new DispatchEventInvitationHandler(this.dispatchNotification)
    this.dispatchFollowRequestHandler = new DispatchFollowRequestHandler(this.dispatchNotification)

    this.notificationDeviceController = new NotificationDeviceController(
      registerDevicePushToken,
      unregisterDevicePushToken
    )

    this.notificationsController = new NotificationsController(
      new ListNotifications(appNotificationRepository),
      new CountUnreadNotifications(appNotificationRepository),
      new MarkNotificationAsRead(appNotificationRepository),
      new MarkAllNotificationsAsRead(appNotificationRepository),
      new GetNotificationPreferences(preferencesRepository),
      new UpdateNotificationPreference(preferencesRepository)
    )
  }

  registerEventHandlers(applicationEventBus: ApplicationEventBus) {
    applicationEventBus.subscribe(
      EVENT_CREATED_EVENT,
      this.dispatchEventInvitationHandler,
      'notifications.dispatch-event-invitation'
    )
    applicationEventBus.subscribe(
      FOLLOW_REQUEST_CREATED_EVENT,
      this.dispatchFollowRequestHandler,
      'notifications.dispatch-follow-request'
    )
  }
}
