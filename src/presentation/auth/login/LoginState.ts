interface Field {
  dirty?: boolean
  value: string
}

export interface LoginState {
  loading: boolean
  success?: boolean
  validated: boolean
  error: string | null
  email: Field
  password: Field
  errors: {
    email?: string
    password?: string
  }
}
