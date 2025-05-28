import type Chat from '@/domain/models/chat/Chat'

export interface ChatListState {
  initLoading: boolean
  list: Chat[]
  error: string | null
}
