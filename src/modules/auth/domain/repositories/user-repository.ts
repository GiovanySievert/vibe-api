export interface UserRepository {
  existsByUsername(username: string): Promise<boolean>
  findUsernameOwnerId(username: string): Promise<string | null>
  updateUsername(userId: string, username: string): Promise<void>
}
