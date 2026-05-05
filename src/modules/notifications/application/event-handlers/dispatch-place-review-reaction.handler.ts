import { appLogger } from '@src/config/logger'
import {
  PLACE_REVIEW_REACTION_SET_EVENT,
  PlaceReviewReactionSetEvent
} from '@src/modules/place-review/application/events/place-review-reaction-set.event'
import { ApplicationEventHandler } from '@src/shared/application/events'
import { placeReviewReactionTemplate } from '../templates/place-review-reaction.template'
import { DispatchNotification } from '../use-cases/dispatch-notification'

export class DispatchPlaceReviewReactionHandler
  implements ApplicationEventHandler<PlaceReviewReactionSetEvent>
{
  constructor(private readonly dispatchNotification: DispatchNotification) {}

  async handle(event: PlaceReviewReactionSetEvent): Promise<void> {
    if (event.name !== PLACE_REVIEW_REACTION_SET_EVENT) {
      return
    }

    const resolved = placeReviewReactionTemplate(event)

    if (!resolved || resolved.userIds.length === 0) {
      return
    }

    try {
      await this.dispatchNotification.execute({ userIds: resolved.userIds, payload: resolved.payload })
    } catch (error) {
      appLogger.warn('Failed to dispatch place review reaction notification', {
        error,
        reviewId: event.payload.reviewId,
        reactorId: event.payload.reactorId
      })
    }
  }
}
