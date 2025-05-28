import Cubit from '@/presentation/common/Cubit'
import type { CreateGroupChatState } from './CreateGroupChatState'
import type { UserRepository } from '@/domain/repository/UserRepository'
import { chatRepositoryKey, userRepositoryKey } from '@/di'
import { inject } from 'inversify'
import User from '@/domain/models/user/user'
import type { ChatRepository } from '@/domain/repository/ChatRepository'

export default class CreateGroupChatCubit extends Cubit<CreateGroupChatState> {
  constructor(
    @inject(userRepositoryKey) private readonly userRepository: UserRepository,
    @inject(chatRepositoryKey) private readonly chatRepository: ChatRepository,
  ) {
    super({
      submitLoading: false,
      suggestionsLoading: false,
      suggestions: [],
      chatUsers: [],
      chatTitle: '',
    })
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

  addUser(user: User): void {
    if (user instanceof User) {
      if (this.state.chatUsers.find((e) => e.id === user.id)) return

      this.emit({
        ...this.state,
        chatUsers: [...this.state.chatUsers, user],
      })
    }
  }

  removeUser(user: User): void {
    this.emit({
      ...this.state,
      chatUsers: this.state.chatUsers.filter((u) => u.id !== user.id),
    })
  }

  setTitle(value: string): void {
    this.emit({ ...this.state, chatTitle: value })
  }

  async submit(): Promise<void> {
    if (this.state.chatUsers.length === 0) {
      this.emit({ ...this.state, error: 'Необходимо добавить пользователей' })
      return
    }

    if (!this.state.chatTitle || this.state.chatTitle?.length < 2) {
      this.emit({
        ...this.state,
        error: 'Наименование должно быть больше 2х символов',
      })
      return
    }

    this.emit({ ...this.state, submitLoading: true })
    const result = await this.chatRepository.createGroupChat({
      userIds: this.state.chatUsers.map((e) => e.id),
      title: this.state.chatTitle,
    })
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
