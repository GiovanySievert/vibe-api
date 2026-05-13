import {
  CreatePlaceReview,
  CreatePlaceReviewComment,
  DeletePlaceReviewComment,
  GetPlaceReview,
  GetPlaceReviewCounts,
  GetPlaceReviewEligibility,
  GetReviewInteractionCount,
  ListPlaceReviews,
  ListFollowingFeed,
  ListPlaceReviewComments,
  ListReviewInteractions,
  RemovePlaceReviewReaction,
  SetPlaceReviewReaction,
  UpdatePlaceReview,
  DeletePlaceReview
} from '../../../application/use-cases'
import { User } from 'better-auth/types'
import { CreatePlaceReviewDto, UpdatePlaceReviewDto } from '../dtos'
import { ApplicationEventBus } from '@src/shared/application/events'
import { createPlaceReviewCommentCreatedEvent } from '../../../application/events/place-review-comment-created.event'
import { createPlaceReviewReactionSetEvent } from '../../../application/events/place-review-reaction-set.event'

export class PlaceReviewController {
  constructor(
    private readonly createPlaceReview: CreatePlaceReview,
    private readonly createPlaceReviewComment: CreatePlaceReviewComment,
    private readonly deletePlaceReviewComment: DeletePlaceReviewComment,
    private readonly getPlaceReview: GetPlaceReview,
    private readonly getPlaceReviewCounts: GetPlaceReviewCounts,
    private readonly getPlaceReviewEligibility: GetPlaceReviewEligibility,
    private readonly getReviewInteractionCount: GetReviewInteractionCount,
    private readonly listPlaceReviews: ListPlaceReviews,
    private readonly listFollowingFeed: ListFollowingFeed,
    private readonly listPlaceReviewComments: ListPlaceReviewComments,
    private readonly listReviewInteractions: ListReviewInteractions,
    private readonly setPlaceReviewReaction: SetPlaceReviewReaction,
    private readonly removePlaceReviewReaction: RemovePlaceReviewReaction,
    private readonly updatePlaceReview: UpdatePlaceReview,
    private readonly deletePlaceReview: DeletePlaceReview,
    private readonly applicationEventBus: ApplicationEventBus
  ) {}

  async create({ body, user }: { body: CreatePlaceReviewDto; user: User }) {
    return await this.createPlaceReview.execute({
      userId: user.id,
      placeId: body.placeId,
      placeName: body.placeName,
      rating: body.rating,
      placeImageUrl: body.placeImageUrl,
      userLat: body.userLat,
      userLng: body.userLng,
      placeLat: body.placeLat,
      placeLng: body.placeLng,
      selfieUrl: body.selfieUrl ?? null,
      selfieFriendsOnly: body.selfieFriendsOnly ?? false,
      comment: body.comment ?? null
    })
  }

  async eligibility({ params, user }: { params: { placeId: string }; user: User }) {
    return await this.getPlaceReviewEligibility.execute({
      userId: user.id,
      placeId: params.placeId
    })
  }

  async getById({ params }: { params: { reviewId: string }; user: User }) {
    return await this.getPlaceReview.execute(params.reviewId)
  }

  async getCounts({ params, user }: { params: { reviewId: string }; user: User }) {
    const [counts] = await this.getPlaceReviewCounts.execute([params.reviewId], user.id)
    return counts
  }

  async listByPlace({
    params,
    query,
    user
  }: {
    params: { placeId: string }
    query: { page?: number; since?: string }
    user: User
  }) {
    const since = query.since ? new Date(query.since) : new Date(Date.now() - 24 * 60 * 60 * 1000)
    return await this.listPlaceReviews.executeByPlace(params.placeId, since, query.page, user.id)
  }

  async listByUser({ params, query, user }: { params: { userId: string }; query: { page?: number }; user: User }) {
    return await this.listPlaceReviews.executeByUser(params.userId, query.page, user.id)
  }

  async feed({ user, query }: { user: User; query: { page?: number } }) {
    return await this.listFollowingFeed.execute(user.id, query.page)
  }

  async listComments({ params, query }: { params: { reviewId: string }; query: { page?: number } }) {
    return await this.listPlaceReviewComments.execute({
      reviewId: params.reviewId,
      page: query.page ?? 1,
      limit: 20
    })
  }

  async createComment({
    params,
    body,
    user
  }: {
    params: { reviewId: string }
    body: { content: string }
    user: User
  }) {
    const review = await this.getPlaceReview.execute(params.reviewId)
    if (!review) throw new Error('Place review not found')

    const comment = await this.createPlaceReviewComment.execute({
      reviewId: params.reviewId,
      userId: user.id,
      content: body.content
    })

    if (review.userId !== user.id) {
      await this.applicationEventBus.publish(
        createPlaceReviewCommentCreatedEvent({
          commentId: comment.id,
          reviewId: params.reviewId,
          reviewOwnerId: review.userId,
          commenterId: user.id,
          commenterName: user.name
        })
      )
    }

    return comment
  }

  async react({
    params,
    body,
    user
  }: {
    params: { reviewId: string }
    body: { type: 'on' | 'off' }
    user: User
  }) {
    const review = await this.getPlaceReview.execute(params.reviewId)
    if (!review) throw new Error('Place review not found')

    await this.setPlaceReviewReaction.execute({
      reviewId: params.reviewId,
      userId: user.id,
      type: body.type
    })

    if (body.type === 'on' && review.userId !== user.id) {
      await this.applicationEventBus.publish(
        createPlaceReviewReactionSetEvent({
          reviewId: params.reviewId,
          reviewOwnerId: review.userId,
          reactorId: user.id,
          reactorName: user.name,
          reactionType: body.type
        })
      )
    }

    return { success: true }
  }

  async removeReaction({ params, user }: { params: { reviewId: string }; user: User }) {
    await this.removePlaceReviewReaction.execute({
      reviewId: params.reviewId,
      userId: user.id
    })

    return { success: true }
  }

  async getInteractionCount({ params }: { params: { reviewId: string }; user: User }) {
    return this.getReviewInteractionCount.execute(params.reviewId)
  }

  async listInteractions({
    params,
    query
  }: {
    params: { reviewId: string }
    query: { type: 'on' | 'off'; page?: number }
    user: User
  }) {
    return this.listReviewInteractions.execute(params.reviewId, query.type, query.page ?? 1)
  }

  async deleteComment({ params, user }: { params: { reviewId: string; commentId: string }; user: User }) {
    await this.deletePlaceReviewComment.execute(params.commentId, params.reviewId, user.id)
  }

  async update({ params, body }: { params: { reviewId: string }; body: UpdatePlaceReviewDto }) {
    return await this.updatePlaceReview.execute(params.reviewId, body)
  }

  async delete({ params, user }: { params: { reviewId: string }; user: User }) {
    await this.deletePlaceReview.execute(params.reviewId, user.id)
  }
}
