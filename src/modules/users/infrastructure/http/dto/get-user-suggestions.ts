import { UserSuggestion } from '@src/modules/users/domain/repositories'

export class GetUserSuggestionsDto {
  static fromArray(data: UserSuggestion[]) {
    return data.map((item) => ({
      id: item.id,
      username: item.username,
      image: item.image,
      mutualCount: item.mutualCount
    }))
  }
}
