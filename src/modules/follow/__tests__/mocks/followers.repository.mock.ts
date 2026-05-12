import { Followers } from '../../domain/mappers'
import { FollowersRepository, FollowRequestsRepository } from '../../domain/repositories'
import { ListUserFollowResponseDto, FollowStatusResponseDto, FollowStatusResponseDtoMapper } from '../../infrastructure/http/dtos'
import { FollowStatus, FollowRequestStatus } from '../../domain/types'

export class MockFollowersRepository implements FollowersRepository {
  private followers: Followers[] = []
  private followRequestRepo?: FollowRequestsRepository

  constructor(followRequestRepo?: FollowRequestsRepository) {
    this.followRequestRepo = followRequestRepo
  }

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

  async listFollowers(userId: string, page?: number, limit?: number): Promise<ListUserFollowResponseDto[]> {
    const pageSize = limit ?? 10
    const currentPage = page ?? 1
    const offset = (currentPage - 1) * pageSize
    return this.followers
      .filter((f) => f.followingId === userId)
      .map((f) => ({ id: f.id, userId: f.followerId, username: `user-${f.followerId}`, name: `Name ${f.followerId}`, image: null }))
      .slice(offset, offset + pageSize)
  }

  async listFollowings(userId: string, page?: number, limit?: number): Promise<ListUserFollowResponseDto[]> {
    const pageSize = limit ?? 10
    const currentPage = page ?? 1
    const offset = (currentPage - 1) * pageSize
    return this.followers
      .filter((f) => f.followerId === userId)
      .map((f) => ({ id: f.id, userId: f.followingId, username: `user-${f.followingId}`, name: `Name ${f.followingId}`, image: null }))
      .slice(offset, offset + pageSize)
  }

  async searchFollowers(userId: string, q: string, page?: number, limit?: number): Promise<ListUserFollowResponseDto[]> {
    const lower = q.toLowerCase()
    const pageSize = limit ?? 10
    const currentPage = page ?? 1
    const offset = (currentPage - 1) * pageSize
    return this.followers
      .filter((f) => f.followingId === userId)
      .map((f) => ({ id: f.id, userId: f.followerId, username: `user-${f.followerId}`, name: `Name ${f.followerId}`, image: null }))
      .filter((f) => f.username.toLowerCase().includes(lower) || f.name.toLowerCase().includes(lower))
      .slice(offset, offset + pageSize)
  }

  async searchFollowings(userId: string, q: string, page?: number, limit?: number): Promise<ListUserFollowResponseDto[]> {
    const lower = q.toLowerCase()
    const pageSize = limit ?? 10
    const currentPage = page ?? 1
    const offset = (currentPage - 1) * pageSize
    return this.followers
      .filter((f) => f.followerId === userId)
      .map((f) => ({ id: f.id, userId: f.followingId, username: `user-${f.followingId}`, name: `Name ${f.followingId}`, image: null }))
      .filter((f) => f.username.toLowerCase().includes(lower) || f.name.toLowerCase().includes(lower))
      .slice(offset, offset + pageSize)
  }

  async delete(followId: string): Promise<void> {
    this.followers = this.followers.filter((f) => f.id !== followId)
  }

  async getFollowStatus(followerId: string, followingId: string): Promise<FollowStatusResponseDto> {
    if (this.followRequestRepo) {
      const request = await this.followRequestRepo.getByRequesterAndRequested(followerId, followingId)

      if (request) {
        if (request.status === FollowRequestStatus.ACCEPTED) {
          return FollowStatusResponseDtoMapper.create(FollowStatus.FOLLOWING, request.id)
        }
        if (request.status === FollowRequestStatus.PENDING) {
          return FollowStatusResponseDtoMapper.create(FollowStatus.PENDING, request.id)
        }
      }
    }

    const follower = this.followers.find((f) => f.followerId === followerId && f.followingId === followingId)
    if (follower) {
      return FollowStatusResponseDtoMapper.create(FollowStatus.FOLLOWING, follower.id)
    }
    return FollowStatusResponseDtoMapper.create(FollowStatus.NONE)
  }

  async getByFollowerAndFollowing(followerId: string, followingId: string): Promise<Followers | null> {
    return this.followers.find((f) => f.followerId === followerId && f.followingId === followingId) || null
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
