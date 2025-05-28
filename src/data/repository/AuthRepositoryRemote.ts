import type TokenModel from '@/domain/models/auth/TokenModel'
import type { Either } from '@/domain/models/common/Either'
import type { AuthRepository } from '@/domain/repository/AuthRepository'
import { SupaDataSource } from '../datasource/supabase'
import { inject } from 'inversify'
import type { LoginPayload } from '@/domain/models/auth/LoginPayload'
import type AuthState from '@/domain/models/auth/AuthState'
import type { Observable } from 'rxjs'
import type { RegisterPayload } from '@/domain/models/auth/RegisterPayload'
import type { DataError } from '@/domain/models/common/DataError'

export default class AuthRepositoryRemote implements AuthRepository {
  constructor(@inject(SupaDataSource) private readonly datasource: SupaDataSource) {}

  get authStateStream(): Observable<AuthState> {
    return this.datasource.auth.authStateStream
  }

  login(payload: LoginPayload): Promise<Either<DataError, TokenModel>> {
    return this.datasource.auth.login(payload)
  }

  register(payload: RegisterPayload): Promise<Either<DataError, TokenModel>> {
    return this.datasource.auth.register(payload)
  }

  signOut(): Promise<Either<DataError, null>> {
    return this.datasource.auth.signOut()
  }

  initialize(): Promise<Either<DataError, null>> {
    return this.datasource.auth.initialize()
  }
}
