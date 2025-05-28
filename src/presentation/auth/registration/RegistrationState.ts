interface Field {
  dirty?: boolean
  value: string
}

export interface RegistrationState {
  loading: boolean
  success?: boolean
  validated: boolean
  error: string | null
  name: Field
  email: Field
  password: Field
  confirmPassword: Field
  errors: {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }
}
