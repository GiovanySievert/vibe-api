export interface UserRepository {
  existsByUsername(username: string): Promise<boolean>
}
