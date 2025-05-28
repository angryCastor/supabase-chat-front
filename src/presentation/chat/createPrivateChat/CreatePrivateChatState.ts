import type User from '@/domain/models/user/user'

export interface CreatePrivateChatState {
  submitLoading: boolean
  suggestionsLoading: boolean
  suggestions: User[]
  userTarget?: User | null
  error?: string | null
  successChatId?: number
}
