import { SerializeError } from '../common/DataError'

export default class Message {
  public readonly id: number
  public readonly createdAt: Date
  public readonly userId: string
  public readonly chatId: number
  public readonly value: string

  constructor({
    id,
    createdAt,
    userId,
    chatId,
    value,
  }: {
    id: number
    createdAt: Date
    userId: string
    chatId: number
    value: string
  }) {
    this.id = id
    this.createdAt = createdAt
    this.userId = userId
    this.chatId = chatId
    this.value = value
  }

  static fromJson(json: unknown): Message {
    if (
      typeof json === 'object' &&
      json !== null &&
      'id' in json &&
      'created_at' in json &&
      'user_id' in json &&
      'chat_id' in json &&
      'value' in json &&
      typeof (json as { id: unknown }).id === 'number' &&
      typeof (json as { created_at: unknown }).created_at === 'string' &&
      typeof (json as { user_id: unknown }).user_id === 'string' &&
      typeof (json as { chat_id: unknown }).chat_id === 'number' &&
      typeof (json as { value: unknown }).value === 'string'
    ) {
      const obj = json as {
        id: number
        created_at: string
        user_id: string
        chat_id: number
        value: string
      }
      return new Message({
        id: obj.id,
        createdAt: new Date(obj.created_at),
        userId: obj.user_id,
        chatId: obj.chat_id,
        value: obj.value,
      })
    }
    throw new SerializeError('Invalid JSON for Message')
  }
}
