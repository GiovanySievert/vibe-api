import { PlaceReviewRepository } from '../../domain/repositories'

export class DeletePlaceReviewComment {
  constructor(private readonly placeReviewRepo: PlaceReviewRepository) {}

  async execute(commentId: string, reviewId: string, requesterId: string): Promise<void> {
    const [comment, review] = await Promise.all([
      this.placeReviewRepo.getCommentById(commentId),
      this.placeReviewRepo.getById(reviewId)
    ])

    if (!comment) throw new Error('Comment not found')
    if (!review) throw new Error('Review not found')
    if (comment.userId !== requesterId && review.userId !== requesterId) throw new Error('Unauthorized')

    await this.placeReviewRepo.deleteComment(commentId)
  }
}
