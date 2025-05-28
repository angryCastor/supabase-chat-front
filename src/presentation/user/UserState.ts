import type User from '@/domain/models/user/user'

export interface UserState {
  loading: boolean
  user?: User
  error?: string | null
}
