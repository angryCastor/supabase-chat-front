import { inject } from 'inversify'
import { SupaDataSource } from '../datasource/supabase'
import type { DataError } from '@/domain/models/common/DataError'
import { Either } from '@/domain/models/common/Either'
import { Observable } from 'rxjs'
import type { MessageRepository } from '@/domain/repository/MessageRepository'
import type Message from '@/domain/models/message/Message'
import type { CreateMessagePayload } from '@/domain/models/message/CreateMessagePayload'
import type { ListMessagePayload } from '@/domain/models/message/ListMessagePayload'

export default class MessageRepositoryRemote implements MessageRepository {
  constructor(@inject(SupaDataSource) private readonly datasource: SupaDataSource) {}

  get messageCreatedStream(): Observable<Message> {
    return this.datasource.message.messageCreatedStream
  }

  initialize(): void {
    this.datasource.message.initialize()
  }

  createMessage(payload: CreateMessagePayload): Promise<Either<DataError, void>> {
    return this.datasource.message.createMessage(payload)
  }

  fetchByChatId(payload: ListMessagePayload): Promise<Either<DataError, Message[]>> {
    return this.datasource.message.fetchByChatId(payload)
  }

  fetchMessageCountByChatId(chatId: number): Promise<Either<DataError, number>> {
    return this.datasource.message.fetchMessageCountByChatId(chatId)
  }

  dispose(): void {
    this.datasource.message.dispose()
  }
}
