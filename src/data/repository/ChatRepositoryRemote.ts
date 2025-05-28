import type { ChatRepository } from '@/domain/repository/ChatRepository'
import { inject } from 'inversify'
import { SupaDataSource } from '../datasource/supabase'
import type Chat from '@/domain/models/chat/Chat'
import type { DataError } from '@/domain/models/common/DataError'
import { Either } from '@/domain/models/common/Either'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import type { CreateGroupChatPayload } from '@/domain/models/chat/CreateGroupChatPayload'

export default class ChatRepositoryRemote implements ChatRepository {
  private readonly streamController: BehaviorSubject<Either<DataError, Chat[]>>
  private subscription?: Subscription | null

  constructor(@inject(SupaDataSource) private readonly datasource: SupaDataSource) {
    this.streamController = new BehaviorSubject<Either<DataError, Chat[]>>(Either.right([]))
  }

  initialize(): void {
    this.datasource.chat.initialize()
    this.subscription = this.datasource.chat.chatCreatedStream.subscribe(() => {
      this.refresh()
    })
  }

  get stream(): Observable<Either<DataError, Chat[]>> {
    return this.streamController.asObservable()
  }

  async refresh(): Promise<void> {
    const result = await this.datasource.chat.fetchChats()
    this.streamController.next(result)
  }

  async createPrivateChat(targetUserId: string): Promise<Either<DataError, number>> {
    const result = await this.datasource.chat.createPrivateChat(targetUserId)
    if (result.isRight()) {
      await this.refresh()
    }
    return result
  }

  async createGroupChat(payload: CreateGroupChatPayload): Promise<Either<DataError, number>> {
    const result = await this.datasource.chat.createGroupChat(payload)

    if (result.isRight()) {
      await this.refresh()
    }
    return result
  }

  fetchById(id: number): Promise<Either<DataError, Chat>> {
    return this.datasource.chat.fetchById(id)
  }

  dispose(): void {
    this.subscription?.unsubscribe()
    this.datasource.chat.dispose()
  }
}
