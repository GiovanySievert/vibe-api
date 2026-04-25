import { ApplicationEvent, ApplicationEventHandler } from './application-event'

export interface ApplicationEventBus {
  publish<TEvent extends ApplicationEvent>(event: TEvent): Promise<void>
  subscribe<TEvent extends ApplicationEvent>(
    eventName: TEvent['name'],
    handler: ApplicationEventHandler<TEvent>,
    subscriberId?: string
  ): void
}
