import type { DataError } from '../models/common/DataError'
import type { Either } from '../models/common/Either'
import type { IDisposable } from '../models/common/IDisposable'
import type { Observable } from 'rxjs'
import type Message from '../models/message/Message'
import type { CreateMessagePayload } from '../models/message/CreateMessagePayload'
import type { ListMessagePayload } from '../models/message/ListMessagePayload'

export interface MessageRepository extends IDisposable {
  messageCreatedStream: Observable<Message>
  fetchByChatId: (payload: ListMessagePayload) => Promise<Either<DataError, Message[]>>
  fetchMessageCountByChatId: (chatId: number) => Promise<Either<DataError, number>>
  initialize: () => void
  createMessage: (payload: CreateMessagePayload) => Promise<Either<DataError, void>>
}
