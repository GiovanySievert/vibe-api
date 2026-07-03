import { beforeEach, describe, expect, it } from 'bun:test'

import { MockUserBlockRepository } from '@src/modules/blocks/__tests__/mocks/user-block.repository.mock'
import { createPlaceReviewCommentCreatedEvent } from '@src/modules/place-review/application/events/place-review-comment-created.event'
import { createPlaceReviewReactionSetEvent } from '@src/modules/place-review/application/events/place-review-reaction-set.event'
import {
  DispatchPlaceReviewCommentHandler,
  DispatchPlaceReviewReactionHandler
} from '../../application/event-handlers'
import { DispatchNotification } from '../../application/use-cases/dispatch-notification'
import { MockNotificationChannel } from '../mocks/notification-channel.mock'
import { MockNotificationPreferencesRepository } from '../mocks/notification-preferences.repository.mock'

describe('DispatchPlaceReview event handlers', () => {
  let userBlockRepository: MockUserBlockRepository
  let inAppChannel: MockNotificationChannel
  let pushChannel: MockNotificationChannel
  let dispatchNotification: DispatchNotification

  beforeEach(() => {
    userBlockRepository = new MockUserBlockRepository()
    inAppChannel = new MockNotificationChannel('in_app')
    pushChannel = new MockNotificationChannel('push')
    dispatchNotification = new DispatchNotification(
      new MockNotificationPreferencesRepository(),
      inAppChannel,
      pushChannel
    )
  })

  it('does not dispatch comment notification when users are blocked', async () => {
    await userBlockRepository.create('owner-1', 'commenter-1')
    const handler = new DispatchPlaceReviewCommentHandler(dispatchNotification, userBlockRepository)

    await handler.handle(createPlaceReviewCommentCreatedEvent({
      commentId: 'comment-1',
      reviewId: 'review-1',
      reviewOwnerId: 'owner-1',
      commenterId: 'commenter-1',
      commenterName: 'Commenter'
    }))

    expect(inAppChannel.calls).toHaveLength(0)
    expect(pushChannel.calls).toHaveLength(0)
  })

  it('does not dispatch reaction notification when users are blocked', async () => {
    await userBlockRepository.create('reactor-1', 'owner-1')
    const handler = new DispatchPlaceReviewReactionHandler(dispatchNotification, userBlockRepository)

    await handler.handle(createPlaceReviewReactionSetEvent({
      reviewId: 'review-1',
      reviewOwnerId: 'owner-1',
      reactorId: 'reactor-1',
      reactorName: 'Reactor',
      reactionType: 'on'
    }))

    expect(inAppChannel.calls).toHaveLength(0)
    expect(pushChannel.calls).toHaveLength(0)
  })

  it('dispatches when users are not blocked', async () => {
    const handler = new DispatchPlaceReviewReactionHandler(dispatchNotification, userBlockRepository)

    await handler.handle(createPlaceReviewReactionSetEvent({
      reviewId: 'review-1',
      reviewOwnerId: 'owner-1',
      reactorId: 'reactor-1',
      reactorName: 'Reactor',
      reactionType: 'on'
    }))

    expect(inAppChannel.calls[0].userIds).toEqual(['owner-1'])
    expect(pushChannel.calls[0].userIds).toEqual(['owner-1'])
  })
})
