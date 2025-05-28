import { SerializeError } from '../common/DataError'

export default class User {
  readonly id: string
  readonly email: string
  readonly name: string

  get shortName(): string {
    return this.name.substring(0, 2).toUpperCase()
  }

  constructor({ id, email, name }: { id: string; email: string; name: string }) {
    this.id = id
    this.email = email
    this.name = name
  }

  static fromJson(json: unknown): User {
    if (
      typeof json === 'object' &&
      json !== null &&
      'id' in json &&
      'email' in json &&
      'name' in json &&
      typeof (json as { id: unknown }).id === 'string' &&
      typeof (json as { email: unknown }).email === 'string' &&
      typeof (json as { name: unknown }).name === 'string'
    ) {
      const obj = json as { id: string; email: string; name: string }
      return new User({
        id: obj.id,
        email: obj.email,
        name: obj.name,
      })
    }
    throw new SerializeError('Invalid JSON for User')
  }
}
