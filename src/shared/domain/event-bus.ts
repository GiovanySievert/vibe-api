export interface EventBus {
  publish(eventName: string, data: any): Promise<void>
}
