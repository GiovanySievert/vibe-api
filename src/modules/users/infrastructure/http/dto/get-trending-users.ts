import { TrendingUser } from '@src/modules/users/domain/repositories'

export class GetTrendingUsersDto {
  static fromArray(data: TrendingUser[]) {
    return data.map((item) => ({
      id: item.id,
      username: item.username,
      image: item.image,
      reviewsCount: item.reviewsCount
    }))
  }
}
