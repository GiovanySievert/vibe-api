import { Followers } from '../../domain/mappers'
import { FollowersRepository } from '../../domain/repositories'
import { ListUserFollowResponseDto } from '../../infrastructure/http/dtos'

export class MockFollowersRepository implements FollowersRepository {
  private followers: Followers[] = []

  async create(data: Omit<Followers, 'id' | 'createdAt'>): Promise<Followers> {
    const newFollower: Followers = {
      id: crypto.randomUUID(),
      followerId: data.followerId,
      followingId: data.followingId,
      createdAt: new Date()
    }
    this.followers.push(newFollower)
    return newFollower
  }

  async listFollowers(userId: string): Promise<ListUserFollowResponseDto[]> {
    return this.followers
      .filter((f) => f.followingId === userId)
      .map((f) => ({
        id: f.id,
        userId: f.followerId,
        username: `user-${f.followerId}`,
        image: null
      }))
  }

  async listFollowings(userId: string): Promise<ListUserFollowResponseDto[]> {
    return this.followers
      .filter((f) => f.followerId === userId)
      .map((f) => ({
        id: f.id,
        userId: f.followingId,
        username: `user-${f.followingId}`,
        image: null
      }))
  }

  async delete(followId: string): Promise<void> {
    this.followers = this.followers.filter((f) => f.id !== followId)
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return this.followers.some((f) => f.followerId === followerId && f.followingId === followingId)
  }

  reset() {
    this.followers = []
  }

  seed(data: Followers[]) {
    this.followers = [...data]
  }

  getAll() {
    return [...this.followers]
  }
}
