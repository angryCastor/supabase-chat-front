import { chatRepositoryKey, messageRepositoryKey } from '@/di'
import Cubit from '../../common/Cubit'
import type { ChatListState } from './ChatListState'
import type { ChatRepository } from '@/domain/repository/ChatRepository'
import { inject } from 'inversify'
import type { IDisposable } from '@/domain/models/common/IDisposable'
import type { MessageRepository } from '@/domain/repository/MessageRepository'
import type Message from '@/domain/models/message/Message'
import type { Subscription } from 'rxjs'

export default class ChatListCubit extends Cubit<ChatListState> implements IDisposable {
  private messageSubscription?: Subscription

  constructor(
    @inject(chatRepositoryKey) private readonly chatRepository: ChatRepository,
    @inject(messageRepositoryKey)
    private readonly messageRepository: MessageRepository,
  ) {
    super({ initLoading: true, list: [], error: null })
    chatRepository.stream.subscribe((result) => {
      result.fold(
        (error) => {
          this.emit({ ...this.state, error: error.message })
        },
        (value) => {
          this.emit({ ...this.state, list: value, error: null })
        },
      )
    })
  }

  async refresh() {
    await this.chatRepository.refresh()
    this.emit({ ...this.state, initLoading: false })
  }

  initialize() {
    this.chatRepository.initialize()
    this.refresh()
    this.messageSubscription = this.messageRepository.messageCreatedStream.subscribe(
      this.newMassageHandler.bind(this),
    )
  }

  dispose() {
    this.messageSubscription?.unsubscribe()
    this.chatRepository.dispose()
  }

  private newMassageHandler(message: Message): void {
    const list = [...this.state.list]
    const index = list.findIndex((c) => c.id === message.chatId)

    if (index === -1) {
      return
    }

    const updatedChat = list[index].copyWith({
      lastMessage: {
        createAt: message.createdAt,
        userId: message.userId,
        text: message.value,
      },
    })

    list[index] = updatedChat
    list.sort((a, b) => b.displayCreatedAt.getTime() - a.displayCreatedAt.getTime())

    this.emit({ ...this.state, list })
  }
}
