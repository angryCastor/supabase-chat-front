import Cubit from '@/presentation/common/Cubit'
import type { ChatDetailState } from './ChatDetailState'
import type { IDisposable } from '@/domain/models/common/IDisposable'
import type { ChatRepository } from '@/domain/repository/ChatRepository'
import type { UserRepository } from '@/domain/repository/UserRepository'
import type { MessageRepository } from '@/domain/repository/MessageRepository'
import type { DataError } from '@/domain/models/common/DataError'
import type Message from '@/domain/models/message/Message'
import type Chat from '@/domain/models/chat/Chat'
import type User from '@/domain/models/user/user'
import type { Subscription } from 'rxjs'

const PAGINATION_LIMIT = 40

const initialState: ChatDetailState = {
  initLoad: true,
  initialized: false,
  messages: [],
  users: [],
  messageValue: '',
  offset: 0,
  messageCount: 0,
  loadMoreLoading: false,
  canLoadMore: false,
}

export default class ChatDetailCubit extends Cubit<ChatDetailState> implements IDisposable {
  private static instances = new Map<number, ChatDetailCubit>()
  private subscription?: Subscription

  private constructor(
    private readonly chatId: number,
    private readonly chatRepository: ChatRepository,
    private readonly userRepository: UserRepository,
    private readonly messageRepository: MessageRepository,
  ) {
    super(initialState)
  }

  static fromChatId(
    chatId: number,
    chatRepository: ChatRepository,
    userRepository: UserRepository,
    messageRepository: MessageRepository,
  ): ChatDetailCubit {
    if (this.instances.has(chatId)) {
      return this.instances.get(chatId)!
    }

    const instance = new ChatDetailCubit(chatId, chatRepository, userRepository, messageRepository)
    this.instances.set(chatId, instance)

    return instance
  }

  static dispose(): void {
    Array.from(this.instances.values()).forEach((cubit) => {
      cubit.subscription?.unsubscribe()
    })
    this.instances.clear()
  }

  async initialize(): Promise<void> {
    if (this.state.initialized && !this.state.initError) {
      return
    }

    this.emit({ ...this.state, initLoad: true, initError: null })

    const result = await Promise.all([
      this.chatRepository.fetchById(this.chatId),
      this.messageRepository.fetchByChatId({
        chatId: this.chatId,
        limit: PAGINATION_LIMIT,
        offset: 0,
      }),
      this.userRepository.me(),
      this.userRepository.fetchUsersByChatId(this.chatId),
      this.messageRepository.fetchMessageCountByChatId(this.chatId),
    ])

    const error = result.reduce<DataError | null>((p, c) => (c.isLeft() ? c.getLeft() : p), null)

    if (error) {
      this.emit({
        ...this.state,
        initLoad: false,
        initError: error.message,
      })
      return
    }

    const [chat, messages, me, users, messageCount] = result.map((e) => e.get()) as [
      Chat,
      Message[],
      User,
      User[],
      number,
    ]

    const canLoadMore = messageCount > PAGINATION_LIMIT

    this.emit({
      ...this.state,
      initLoad: false,
      initError: null,
      initialized: true,
      me,
      chat,
      messages: messages.reverse(),
      users,
      messageCount,
      canLoadMore,
    })

    this.subscription = this.messageRepository.messageCreatedStream.subscribe(
      this.newMessageHandler.bind(this),
    )
  }

  setMessage(value: string) {
    this.emit({ ...this.state, messageValue: value })
  }

  async sendMessage(): Promise<void> {
    const { sendMessageLoading, messageValue } = this.state

    if (sendMessageLoading || !messageValue) {
      return
    }

    this.emit({ ...this.state, sendMessageLoading: true })

    const result = await this.messageRepository.createMessage({
      chatId: this.chatId,
      value: messageValue,
    })

    result.fold(
      () => {
        this.emit({ ...this.state, sendMessageLoading: false })
      },
      () => {
        this.emit({
          ...this.state,
          sendMessageLoading: false,
          messageValue: '',
        })
      },
    )
  }

  async loadMore() {
    if (!this.state.canLoadMore || this.state.loadMoreLoading) {
      return
    }

    this.emit({ ...this.state, loadMoreLoading: true })

    const result = await this.messageRepository.fetchByChatId({
      chatId: this.chatId,
      limit: PAGINATION_LIMIT,
      offset: this.state.offset + PAGINATION_LIMIT,
    })

    result.fold(
      () => {
        this.emit({
          ...this.state,
          loadMoreLoading: false,
          canLoadMore: false,
        })
      },
      (value) => {
        const offset = this.state.offset + PAGINATION_LIMIT
        const canLoadMore = this.state.messageCount > offset

        this.emit({
          ...this.state,
          messages: [...value.reverse(), ...this.state.messages],
          offset,
          canLoadMore,
          loadMoreLoading: false,
        })
      },
    )
  }

  dispose(): void {
    if (this.state.initialized && !this.state.initError) {
      return
    }

    this.subscription?.unsubscribe()
  }

  private newMessageHandler(message: Message) {
    if (message.chatId === this.chatId) {
      this.emit({
        ...this.state,
        messages: [...this.state.messages, message],
        messageCount: this.state.messageCount + 1,
        offset: this.state.offset + 1,
      })
    }
  }
}
