import type { AuthRepository } from '@/domain/repository/AuthRepository'
import Cubit from '../../common/Cubit'
import type { LoginState } from './LoginState'
import { authRepositoryKey } from '@/di'
import { inject } from 'inversify'
import * as yup from 'yup'

const validateSchema = yup.object({
  email: yup.string().email('Невалидный email').required('Обязательное поле'),
  password: yup.string().min(6, 'Мин. 6 символов').required('Обязательное поле'),
})

const initialState: LoginState = {
  loading: false,
  error: null,
  validated: false,
  email: {
    value: '',
  },
  password: {
    value: '',
  },
  errors: {},
}

export default class LoginCubit extends Cubit<LoginState> {
  constructor(@inject(authRepositoryKey) private readonly repository: AuthRepository) {
    super(initialState)
  }

  changePassword(value: string): void {
    this.emit({
      ...this.state,
      password: {
        value: value,
        dirty: true,
      },
    })
    this.validateForm()
  }

  changeEmail(value: string): void {
    this.emit({
      ...this.state,
      email: {
        value: value,
        dirty: true,
      },
    })
    this.validateForm()
  }

  async login(): Promise<void> {
    this.dirtyAllFields()
    this.validateForm()
    if (!this.state.validated) {
      return
    }

    this.emit({ ...this.state, loading: true, error: null })

    const result = await this.repository.login({
      password: this.state.password.value,
      email: this.state.email.value,
    })

    result.fold(
      (error) => {
        this.emit({ ...this.state, loading: false, error: error.message })
      },
      () => {
        this.emit({ ...this.state, success: true })
      },
    )
  }

  private dirtyAllFields() {
    this.emit({
      ...this.state,
      email: { ...this.state.email, dirty: true },
      password: { ...this.state.password, dirty: true },
    })
  }

  private validateForm(): void {
    try {
      validateSchema.validateSync(
        {
          email: this.state.email.value,
          password: this.state.password.value,
        },
        { abortEarly: false },
      )
      this.emit({ ...this.state, errors: {}, validated: true })
    } catch (e) {
      const validationError = <yup.ValidationError>e
      const errors = validationError.inner.reduce(
        (p, { path, message }) => ({
          ...p,
          [path!]: message,
        }),
        {},
      )
      this.emit({ ...this.state, errors, validated: false })
    }
  }
}
