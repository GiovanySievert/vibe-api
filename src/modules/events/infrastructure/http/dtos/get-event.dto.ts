import { Event, EventParticipant } from '../../../domain/mappers'

export interface GetEventDto {
  id: string
  ownerId: string
  name: string
  date: string
  time: string
  description: string | null
  place: EventPlaceDto | null
  imageUrl: string | null
  createdAt: Date
  participants: EventParticipantDto[]
}

export interface EventPlaceDto {
  id: string
  name: string
  type: string | null
  neighborhood: string | null
}

export interface EventParticipantDto {
  id: string
  userId: string
  username: string
  avatar: string | null
  status: string
}

export class GetEventDtoMapper {
  static from(event: Event): GetEventDto {
    return {
      id: event.id,
      ownerId: event.ownerId,
      name: event.name,
      date: event.date,
      time: event.time,
      description: event.description,
      imageUrl: event.imageUrl,
      place: event.place
        ? {
            id: event.place.id,
            name: event.place.name,
            type: event.place.type,
            neighborhood: event.place.neighborhood
          }
        : null,
      createdAt: event.createdAt,
      participants: (event.participants ?? []).map((p: EventParticipant) => ({
        id: p.id,
        userId: p.userId,
        username: p.username,
        avatar: p.avatar,
        status: p.status
      }))
    }
  }

  static fromArray(events: Event[]): GetEventDto[] {
    return events.map((e) => this.from(e))
  }
}
