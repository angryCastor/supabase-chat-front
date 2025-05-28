import {
  AuthError,
  DataError,
  DataSourceError,
  UnexpectedError,
} from '@/domain/models/common/DataError'
import { Either } from '@/domain/models/common/Either'
import {
  AuthError as SupaAuthError,
  PostgrestError,
  type AuthResponse,
  type AuthTokenResponsePassword,
  type PostgrestSingleResponse,
  type UserResponse,
} from '@supabase/supabase-js'

type Response<T = unknown> =
  | AuthTokenResponsePassword
  | AuthResponse
  | UserResponse
  | PostgrestSingleResponse<T>

export default abstract class SupaDataSourceBase {
  _handleResponse<T, E extends SupaAuthError | PostgrestError | null>(
    response: Response<T>,
  ): Either<DataError, NonNullable<T>> {
    const { data, error } = response as { data: T | null; error: E }
    const e = this._handlerError(error)
    if (e) {
      return Either.left(e)
    }
    return Either.right(data as NonNullable<T>)
  }

  _handlerError(error: SupaAuthError | PostgrestError | null): DataError | null {
    if (error instanceof PostgrestError) {
      return new DataSourceError(error)
    } else if (error instanceof SupaAuthError) {
      return new AuthError(error)
    } else if (error) {
      return new UnexpectedError(error)
    }
    return null
  }
}
