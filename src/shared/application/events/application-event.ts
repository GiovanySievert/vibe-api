export interface ApplicationEvent<TName extends string = string, TPayload = unknown> {
  name: TName
  payload: TPayload
}

export interface ApplicationEventHandler<TEvent extends ApplicationEvent = ApplicationEvent> {
  handle(event: TEvent): Promise<void>
}
