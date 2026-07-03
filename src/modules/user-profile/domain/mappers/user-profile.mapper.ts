export interface UserProfile {
  id: string
  name: string
  bio: string | null
  image: string | null
  imageThumbnail: string | null
  updatedAt: Date
}
