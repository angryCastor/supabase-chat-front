import type { DataError } from '../models/common/DataError'
import type { Either } from '../models/common/Either'
import type User from '../models/user/user'

export interface UserRepository {
  me: () => Promise<Either<DataError, User>>
  searchUsers: (query: string) => Promise<Either<DataError, User[]>>
  fetchUsersByChatId: (chatId: number) => Promise<Either<DataError, User[]>>
}
