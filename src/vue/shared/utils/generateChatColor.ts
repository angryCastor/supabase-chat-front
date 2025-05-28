import type Chat from '@/domain/models/chat/Chat'
import stringToHLS from './stringToHLS'

export default (chat: Chat) => {
  if (chat.id > 0) {
    return stringToHLS(chat.privateChatTitleUserId!)
  } else {
    return stringToHLS(`${chat.createdAt}_${chat.id}`)
  }
}
