import { ApplicationEvent, ApplicationEventHandler } from './application-event'
import { ApplicationEventBus } from './application-event-bus'

export class InMemoryApplicationEventBus implements ApplicationEventBus {
  private readonly handlers = new Map<string, ApplicationEventHandler[]>()
  private readonly registeredSubscribers = new Set<string>()

  async publish<TEvent extends ApplicationEvent>(event: TEvent): Promise<void> {
    const handlers = this.handlers.get(event.name) ?? []

    for (const handler of handlers) {
      await handler.handle(event)
    }
  }

  subscribe<TEvent extends ApplicationEvent>(
    eventName: TEvent['name'],
    handler: ApplicationEventHandler<TEvent>,
    subscriberId?: string
  ): void {
    const dedupeKey = subscriberId ? `${eventName}:${subscriberId}` : null

    if (dedupeKey && this.registeredSubscribers.has(dedupeKey)) {
      return
    }

    const currentHandlers = this.handlers.get(eventName) ?? []
    this.handlers.set(eventName, [...currentHandlers, handler as ApplicationEventHandler])

    if (dedupeKey) {
      this.registeredSubscribers.add(dedupeKey)
    }
  }
}

export const applicationEventBus = new InMemoryApplicationEventBus()
