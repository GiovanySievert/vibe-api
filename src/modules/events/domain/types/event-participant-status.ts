export const EventParticipantStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined'
} as const

export type EventParticipantStatus = (typeof EventParticipantStatus)[keyof typeof EventParticipantStatus]
