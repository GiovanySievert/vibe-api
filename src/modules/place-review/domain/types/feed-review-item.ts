import { PlaceReview } from '../mappers'
import { PlaceReviewReactionType } from './place-review-reaction'

export type FeedReviewItem = Omit<PlaceReview, 'userId'> & {
  userId: string | null
  user: {
    id: string
    username: string
    image: string | null
    imageThumbnail: string | null
  } | null
  isAnonymous: boolean
  isOwnAnonymous: boolean
  viewerReaction: PlaceReviewReactionType | null
  isFavorite: boolean
}
