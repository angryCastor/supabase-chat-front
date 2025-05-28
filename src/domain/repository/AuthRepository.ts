import type TokenModel from '../models/auth/TokenModel'
import type { Either } from '../models/common/Either'
import type { LoginPayload } from '../models/auth/LoginPayload'
import type AuthState from '../models/auth/AuthState'
import type { Observable } from 'rxjs'
import type { RegisterPayload } from '../models/auth/RegisterPayload'
import type { DataError } from '../models/common/DataError'

export interface AuthRepository {
  authStateStream: Observable<AuthState>
  login: (payload: LoginPayload) => Promise<Either<DataError, TokenModel>>
  register: (payload: RegisterPayload) => Promise<Either<DataError, TokenModel>>
  signOut: () => Promise<Either<DataError, null>>
  initialize: () => Promise<Either<DataError, null>>
}
