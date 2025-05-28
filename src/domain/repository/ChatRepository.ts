import type { Observable } from 'rxjs'
import type Chat from '../models/chat/Chat'
import type { DataError } from '../models/common/DataError'
import type { Either } from '../models/common/Either'
import type { IDisposable } from '../models/common/IDisposable'
import type { CreateGroupChatPayload } from '../models/chat/CreateGroupChatPayload'

export interface ChatRepository extends IDisposable {
  stream: Observable<Either<DataError, Chat[]>>
  refresh: () => Promise<void>
  createPrivateChat: (targetUserId: string) => Promise<Either<DataError, number>>
  createGroupChat: (payload: CreateGroupChatPayload) => Promise<Either<DataError, number>>
  fetchById: (id: number) => Promise<Either<DataError, Chat>>
  initialize: () => void
}
