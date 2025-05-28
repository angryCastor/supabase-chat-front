import type Chat from '@/domain/models/chat/Chat'
import type Message from '@/domain/models/message/Message'
import type User from '@/domain/models/user/user'

export interface ChatDetailState {
  initError?: string | null
  initLoad: boolean
  initialized: boolean
  messages: Message[]
  users: User[]
  me?: User
  chat?: Chat
  messageValue: string
  sendMessageLoading?: boolean
  messageCount: number
  offset: number
  loadMoreLoading: boolean
  canLoadMore: boolean
}
