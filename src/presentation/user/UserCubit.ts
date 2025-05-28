import { userRepositoryKey } from '@/di'
import Cubit from '../common/Cubit'
import type { UserState } from './UserState'
import type { UserRepository } from '@/domain/repository/UserRepository'
import { inject } from 'inversify'

export default class UserCubit extends Cubit<UserState> {
  constructor(@inject(userRepositoryKey) private readonly repository: UserRepository) {
    super({ loading: true })
  }

  async fetchMe(): Promise<void> {
    this.emit({ loading: true })

    const result = await this.repository.me()

    result.fold(
      (error) => this.emit({ ...this.state, error: error.message, loading: false }),
      (value) => this.emit({ ...this.state, user: value, error: null, loading: false }),
    )
  }
}
