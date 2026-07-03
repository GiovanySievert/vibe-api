import { PlaceReview } from '../mappers'
import { PlaceReviewReactionType } from './place-review-reaction'

export type FeedReviewItem = PlaceReview & {
  user: {
    id: string
    username: string
    image: string | null
    imageThumbnail: string | null
  }
  viewerReaction: PlaceReviewReactionType | null
  isFavorite: boolean
}
