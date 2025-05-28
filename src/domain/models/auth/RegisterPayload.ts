import type { LoginPayload } from './LoginPayload'

export interface RegisterPayload extends LoginPayload {
  name: string
}
