import { PlaceReview } from '../mappers'
import { PlaceReviewReactionType } from './place-review-reaction'

export type FeedReviewItem = PlaceReview & {
  user: {
    id: string
    username: string
    image: string | null
  }
  viewerReaction: PlaceReviewReactionType | null
}

