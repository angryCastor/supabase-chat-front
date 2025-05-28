import type { UserRepository } from '@/domain/repository/UserRepository'
import { SupaDataSource } from '../datasource/supabase'
import { inject } from 'inversify'
import type { DataError } from '@/domain/models/common/DataError'
import type { Either } from '@/domain/models/common/Either'
import type User from '@/domain/models/user/user'

export default class UserRepositoryRemote implements UserRepository {
  constructor(@inject(SupaDataSource) private readonly datasource: SupaDataSource) {}

  me(): Promise<Either<DataError, User>> {
    return this.datasource.user.me()
  }

  searchUsers(query: string): Promise<Either<DataError, User[]>> {
    return this.datasource.user.searchUsers(query)
  }

  fetchUsersByChatId(chatId: number): Promise<Either<DataError, User[]>> {
    return this.datasource.user.fetchUsersByChatId(chatId)
  }
}
