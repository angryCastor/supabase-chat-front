import Cubit from '@/presentation/common/Cubit'
import type { CreatePrivateChatState } from './CreatePrivateChatState'
import type { UserRepository } from '@/domain/repository/UserRepository'
import { chatRepositoryKey, userRepositoryKey } from '@/di'
import { inject } from 'inversify'
import User from '@/domain/models/user/user'
import type { ChatRepository } from '@/domain/repository/ChatRepository'

export default class CreatePrivateChatCubit extends Cubit<CreatePrivateChatState> {
  constructor(
    @inject(userRepositoryKey) private readonly userRepository: UserRepository,
    @inject(chatRepositoryKey) private readonly chatRepository: ChatRepository,
  ) {
    super({ submitLoading: false, suggestionsLoading: false, suggestions: [] })
  }

  async searchUsers(query: string): Promise<void> {
    if (query.length < 2) {
      this.emit({ ...this.state, suggestions: [] })
      return
    }
    this.emit({ ...this.state, suggestionsLoading: true })

    const result = await this.userRepository.searchUsers(query)

    result.fold(
      () => {
        this.emit({
          ...this.state,
          suggestionsLoading: false,
          suggestions: [],
        })
      },
      (users) =>
        this.emit({
          ...this.state,
          suggestionsLoading: false,
          suggestions: users,
        }),
    )
  }

  selectUser(user: User): void {
    if (user instanceof User) {
      this.emit({ ...this.state, userTarget: user })
    }
  }

  async submit(): Promise<void> {
    if (!(this.state.userTarget instanceof User)) {
      return
    }

    this.emit({ ...this.state, submitLoading: true })

    const result = await this.chatRepository.createPrivateChat(this.state.userTarget!.id)

    result.fold(
      (error) =>
        this.emit({
          ...this.state,
          submitLoading: false,
          error: error.message,
        }),
      (value) =>
        this.emit({
          ...this.state,
          submitLoading: false,
          error: null,
          successChatId: value,
        }),
    )
  }
}
