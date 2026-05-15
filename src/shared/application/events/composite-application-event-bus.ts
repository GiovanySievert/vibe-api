import { ApplicationEvent, ApplicationEventHandler } from './application-event'
import { ApplicationEventBus } from './application-event-bus'

export class CompositeApplicationEventBus implements ApplicationEventBus {
  constructor(
    private readonly local: ApplicationEventBus,
    private readonly bridges: ApplicationEventBus[]
  ) {}

  async publish<TEvent extends ApplicationEvent>(event: TEvent): Promise<void> {
    await this.local.publish(event)

    await Promise.all(this.bridges.map((bridge) => bridge.publish(event)))
  }

  subscribe<TEvent extends ApplicationEvent>(
    eventName: TEvent['name'],
    handler: ApplicationEventHandler<TEvent>,
    subscriberId?: string
  ): void {
    this.local.subscribe(eventName, handler, subscriberId)
  }
}
