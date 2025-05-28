import type { AuthRepository } from '@/domain/repository/AuthRepository'
import Cubit from '../../common/Cubit'
import type { RegistrationState } from './RegistrationState'
import { authRepositoryKey } from '@/di'
import { inject } from 'inversify'
import * as yup from 'yup'

const validateSchema = yup.object({
  name: yup.string().min(6, 'Мин. 6 символов').required('Обязательное поле'),
  email: yup.string().email('Невалидный email').required('Обязательное поле'),
  password: yup.string().min(6, 'Мин. 6 символов').required('Обязательное поле'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Обязательное поле'),
})

const initialState: RegistrationState = {
  loading: false,
  error: null,
  validated: false,
  name: { value: '' },
  email: { value: '' },
  password: { value: '' },
  confirmPassword: { value: '' },
  errors: {},
}

export default class RegistrationCubit extends Cubit<RegistrationState> {
  constructor(@inject(authRepositoryKey) private readonly repository: AuthRepository) {
    super(initialState)
  }

  changeName(value: string): void {
    this.emit({
      ...this.state,
      name: { value: value, dirty: true },
    })
    this.validateForm()
  }

  changeEmail(value: string): void {
    this.emit({
      ...this.state,
      email: { value: value, dirty: true },
    })
    this.validateForm()
  }

  changePassword(value: string): void {
    this.emit({
      ...this.state,
      password: { value: value, dirty: true },
    })
    this.validateForm()
  }

  changeConfirmPassword(value: string): void {
    this.emit({
      ...this.state,
      confirmPassword: { value: value, dirty: true },
    })
    this.validateForm()
  }

  async registration(): Promise<void> {
    this.dirtyAllFields()
    this.validateForm()
    if (!this.state.validated) {
      return
    }

    this.emit({ ...this.state, loading: true, error: null })

    const result = await this.repository.register({
      password: this.state.password.value,
      email: this.state.email.value,
      name: this.state.name.value,
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
      name: { ...this.state.name, dirty: true },
      confirmPassword: { ...this.state.confirmPassword, dirty: true },
    })
  }

  private validateForm(): void {
    try {
      validateSchema.validateSync(
        {
          email: this.state.email.value,
          password: this.state.password.value,
          name: this.state.name.value,
          confirmPassword: this.state.confirmPassword.value,
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
