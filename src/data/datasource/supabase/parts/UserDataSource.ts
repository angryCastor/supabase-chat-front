import type { SupabaseClient } from '@supabase/supabase-js'
import SupaDataSourceBase from './SupaDataSourceBase'
import type { DataError } from '@/domain/models/common/DataError'
import User from '@/domain/models/user/user'
import { Either } from '@/domain/models/common/Either'

export default class UserDataSource extends SupaDataSourceBase {
  private readonly _client: SupabaseClient

  constructor(client: SupabaseClient) {
    super()
    this._client = client
  }

  async me(): Promise<Either<DataError, User>> {
    const response = await this._client.auth.getUser()

    return this._handleResponse(response).map(
      ({ user }) =>
        new User({
          id: user!.id,
          email: user!.email!,
          name: user!.user_metadata.name,
        }),
    )
  }

  async searchUsers(query: string): Promise<Either<DataError, User[]>> {
    const response = await this._client.rpc('search_profiles', {
      prefix: query,
    })

    const result = this._handleResponse(response)

    return result.flatMap((e) => {
      try {
        return Either.right(e.map(User.fromJson))
      } catch (e) {
        return Either.left(e as DataError)
      }
    })
  }

  async fetchUsersByChatId(chatId: number): Promise<Either<DataError, User[]>> {
    const response = await this._client
      .from('profiles')
      .select(`*, conversations_users!inner()`)
      .eq('conversations_users.chat_id', chatId)
      .then()

    const result = this._handleResponse(response)

    return result.flatMap((e) => {
      try {
        return Either.right(e.map(User.fromJson))
      } catch (e) {
        return Either.left(e as DataError)
      }
    })
  }
}
