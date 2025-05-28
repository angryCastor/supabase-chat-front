import type { SupabaseClient } from '@supabase/supabase-js'
import SupaDataSourceBase from './SupaDataSourceBase'
import Chat from '@/domain/models/chat/Chat'
import { Either } from '@/domain/models/common/Either'
import { DataError, DataSourceError } from '@/domain/models/common/DataError'
import { filter, map, Observable } from 'rxjs'
import type { IDisposable } from '@/domain/models/common/IDisposable'
import type { CreateGroupChatPayload } from '@/domain/models/chat/CreateGroupChatPayload'
import type RealTimeDataBase from '../realtime/RealTimeDataBase'

export default class ChatDataSource extends SupaDataSourceBase implements IDisposable {
  private readonly _realTimeDb: RealTimeDataBase
  private readonly _client: SupabaseClient
  private _realTimeDbInsertKey: symbol

  constructor(client: SupabaseClient, realTimeDb: RealTimeDataBase) {
    super()
    this._client = client
    this._realTimeDb = realTimeDb
    this._realTimeDbInsertKey = Symbol()
  }

  get chatCreatedStream(): Observable<number> {
    return this._realTimeDb.stream.pipe(
      filter((p) => p.key === this._realTimeDbInsertKey),
      map(({ payload }) => payload.new.id as number),
    )
  }

  async createPrivateChat(targetUserId: string): Promise<Either<DataError, number>> {
    const createChatResponse = await this._client
      .rpc('create_private_chat', { target_user_id: targetUserId })
      .then()

    return this._handleResponse(createChatResponse)
  }

  async createGroupChat({
    userIds,
    title,
  }: CreateGroupChatPayload): Promise<Either<DataError, number>> {
    const createChatResponse = await this._client
      .rpc('create_group_chat', { title: title, user_ids: userIds })
      .then()

    return this._handleResponse(createChatResponse)
  }

  async fetchChats(): Promise<Either<DataError, Chat[]>> {
    const response = await this._client.from('chat_list').select(`*`).then()

    const result = this._handleResponse(response)

    return result.flatMap((e) => {
      try {
        return Either.right(e.map((c) => Chat.fromJson(c)))
      } catch (e) {
        return Either.left(e as DataError)
      }
    })
  }

  async fetchById(id: number): Promise<Either<DataError, Chat>> {
    const response = await this._client.from('chat_list').select(`*`).eq('id', id).limit(1).then()

    const result = this._handleResponse(response)

    return result.flatMap((value) => {
      if (value.length === 1) {
        return Either.right(Chat.fromJson(value[0]))
      }
      return Either.left(new DataSourceError(new Error('Чат не найден')))
    })
  }

  initialize(): void {
    this._realTimeDb.addConfig(this._realTimeDbInsertKey, {
      event: 'INSERT',
      schema: 'public',
      table: 'conversation',
    })
  }

  dispose(): void {
    this._realTimeDb.removeConfig(this._realTimeDbInsertKey)
  }
}
