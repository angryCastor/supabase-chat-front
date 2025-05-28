import { SerializeError } from '../common/DataError'
import type { WithUndefined } from '../common/WithUndefined'

interface Message {
  userId: string
  createAt: Date
  text: string
}

interface ConstructorProps {
  id: number
  createdAt: Date
  lastMessage?: Message
  privateChatTitleUserId?: string
  privateChatTitle?: string
  groupChatTitle?: string
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

export default class Chat {
  public readonly id: number
  public readonly createdAt: Date
  public readonly lastMessage?: Message
  public readonly privateChatTitleUserId?: string

  private readonly privateChatTitle?: string
  private readonly groupChatTitle?: string

  get chatTitle(): string {
    if (this.id > 0) {
      return this.privateChatTitle as string
    } else {
      return this.groupChatTitle as string
    }
  }

  get chatShortTitle(): string {
    return this.chatTitle.substring(0, 2).toUpperCase()
  }

  get displayCreatedAt(): Date {
    return this.lastMessage?.createAt ?? this.createdAt
  }

  constructor({
    id,
    createdAt,
    lastMessage,
    privateChatTitleUserId,
    privateChatTitle,
    groupChatTitle,
  }: ConstructorProps) {
    this.id = id
    this.createdAt = createdAt
    this.lastMessage = lastMessage
    this.privateChatTitleUserId = privateChatTitleUserId

    this.privateChatTitle = privateChatTitle
    this.groupChatTitle = groupChatTitle
  }

  static fromJson(json: unknown): Chat {
    if (!isObject(json)) {
      throw new SerializeError('Invalid JSON: not an object')
    }

    // Проверка обязательных полей
    if (!('id' in json) || !isNumber(json.id)) throw new SerializeError('Invalid Chat: missing id')
    if (!('created_at' in json) || !isString(json.created_at))
      throw new SerializeError('Invalid Chat: missing created_at')

    // lastMessage проверка
    let lastMessage: Message | undefined
    if (
      'last_message_text' in json &&
      isString(json.last_message_text) &&
      'last_message_user_id' in json &&
      isString(json.last_message_user_id) &&
      'last_message_created_at' in json &&
      isString(json.last_message_created_at)
    ) {
      lastMessage = {
        userId: json.last_message_user_id,
        createAt: new Date(json.last_message_created_at),
        text: json.last_message_text,
      }
    }

    return new Chat({
      id: json.id,
      createdAt: new Date(json.created_at),
      lastMessage,
      privateChatTitleUserId:
        'private_chat_title_user_id' in json && isString(json.private_chat_title_user_id)
          ? json.private_chat_title_user_id
          : undefined,
      privateChatTitle:
        'private_chat_title' in json && isString(json.private_chat_title)
          ? json.private_chat_title
          : undefined,
      groupChatTitle:
        'group_chat_title' in json && isString(json.group_chat_title)
          ? json.group_chat_title
          : undefined,
    })
  }

  copyWith({
    id,
    createdAt,
    lastMessage,
    privateChatTitleUserId,
    privateChatTitle,
    groupChatTitle,
  }: WithUndefined<ConstructorProps>): Chat {
    return new Chat({
      id: id ?? this.id,
      createdAt: createdAt ?? this.createdAt,
      lastMessage: lastMessage ?? this.lastMessage,
      privateChatTitleUserId: privateChatTitleUserId ?? this.privateChatTitleUserId,
      privateChatTitle: privateChatTitle ?? this.privateChatTitle,
      groupChatTitle: groupChatTitle ?? this.groupChatTitle,
    })
  }
}
