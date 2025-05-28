import type User from '@/domain/models/user/user'

export interface CreateGroupChatState {
  submitLoading: boolean
  suggestionsLoading: boolean
  suggestions: User[]
  chatUsers: User[]
  chatTitle: string
  error?: string | null
  successChatId?: number
}
