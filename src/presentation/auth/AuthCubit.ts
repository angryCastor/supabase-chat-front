import Cubit from '../common/Cubit'
import type { AuthRepository } from '@/domain/repository/AuthRepository'
import { inject } from 'inversify'
import { authRepositoryKey } from '@/di'
import AuthState from '@/domain/models/auth/AuthState'

export default class AuthCubit extends Cubit<AuthState> {
  constructor(@inject(authRepositoryKey) private readonly repository: AuthRepository) {
    super(AuthState.LoggedOut)
    this.repository.authStateStream.subscribe(this.emit.bind(this))
  }

  async initialize(): Promise<void> {
    await this.repository.initialize()
  }

  async signOut(): Promise<void> {
    await this.repository.signOut()
  }
}
