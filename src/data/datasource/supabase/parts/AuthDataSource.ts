import { Either } from '@/domain/models/common/Either'
import type { LoginPayload } from '@/domain/models/auth/LoginPayload'
import TokenModel from '@/domain/models/auth/TokenModel'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs'
import AuthState from '@/domain/models/auth/AuthState'
import type { RegisterPayload } from '@/domain/models/auth/RegisterPayload'
import SupaDataSourceBase from './SupaDataSourceBase'
import { AuthError, DataError } from '@/domain/models/common/DataError'

export default class AuthDataSource extends SupaDataSourceBase {
  private readonly _client: SupabaseClient
  private readonly _streamControllerAuthState: BehaviorSubject<AuthState>

  constructor(client: SupabaseClient) {
    super()
    this._client = client
    this._streamControllerAuthState = new BehaviorSubject<AuthState>(AuthState.LoggedOut)

    this._client.auth.onAuthStateChange((e) => {
      const loggedIn = ['SIGNED_IN', 'TOKEN_REFRESHED']
      const loggedOut = ['SIGNED_OUT']

      if (loggedIn.includes(e)) {
        this._streamControllerAuthState.next(AuthState.LoggedIn)
      } else if (loggedOut.includes(e)) {
        this._streamControllerAuthState.next(AuthState.LoggedOut)
      }
    })
  }

  get authStateStream(): Observable<AuthState> {
    return this._streamControllerAuthState.pipe(distinctUntilChanged())
  }

  async initialize(): Promise<Either<DataError, null>> {
    const response = await this._client.auth.initialize()

    const { error } = response

    if (error) {
      return Either.left(new AuthError(error))
    }

    return Either.right(null)
  }

  async login(payload: LoginPayload): Promise<Either<DataError, TokenModel>> {
    const response = await this._client.auth.signInWithPassword(payload)

    return this._handleResponse(response).flatMap((e) => {
      try {
        return Either.right(TokenModel.fromJson(e.session))
      } catch (e) {
        return Either.left(e as DataError)
      }
    })
  }

  async register({
    email,
    password,
    name,
  }: RegisterPayload): Promise<Either<DataError, TokenModel>> {
    const response = await this._client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    return this._handleResponse(response).flatMap((e) => {
      try {
        return Either.right(TokenModel.fromJson(e.session))
      } catch (e) {
        return Either.left(e as DataError)
      }
    })
  }

  async signOut(): Promise<Either<DataError, null>> {
    const response = await this._client.auth.signOut()

    const { error } = response

    if (error) {
      return Either.left(new AuthError(error))
    }

    return Either.right(null)
  }
}
