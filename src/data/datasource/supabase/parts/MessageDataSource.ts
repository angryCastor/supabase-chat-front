import type { SupabaseClient } from '@supabase/supabase-js'
import SupaDataSourceBase from './SupaDataSourceBase'
import { Either } from '@/domain/models/common/Either'
import Message from '@/domain/models/message/Message'
import type { DataError } from '@/domain/models/common/DataError'
import { filter, map, Observable } from 'rxjs'
import type { IDisposable } from '@/domain/models/common/IDisposable'
import type { CreateMessagePayload } from '@/domain/models/message/CreateMessagePayload'
import type { ListMessagePayload } from '@/domain/models/message/ListMessagePayload'
import type RealTimeDataBase from '../realtime/RealTimeDataBase'

export default class MessageDataSource extends SupaDataSourceBase implements IDisposable {
  private readonly _client: SupabaseClient
  private readonly _realTimeDb: RealTimeDataBase
  private _realTimeDbInsertKey: symbol

  constructor(client: SupabaseClient, realTimeDb: RealTimeDataBase) {
    super()
    this._client = client
    this._realTimeDb = realTimeDb
    this._realTimeDbInsertKey = Symbol()
  }

  get messageCreatedStream(): Observable<Message> {
    return this._realTimeDb.stream.pipe(
      filter((p) => p.key === this._realTimeDbInsertKey),
      map(({ payload }) => Message.fromJson(payload.new)),
    )
  }

  async fetchMessageCountByChatId(chatId: number): Promise<Either<DataError, number>> {
    const { error, count } = await this._client
      .from('conversations_messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chatId)
      .then()

    const e = this._handlerError(error)
    if (e) {
      return Either.left(e)
    }

    return Either.right(count!)
  }

  async fetchByChatId({
    chatId,
    limit,
    offset,
  }: ListMessagePayload): Promise<Either<DataError, Message[]>> {
    const response = await this._client
      .from('conversations_messages')
      .select(`*`)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .then()

    const result = this._handleResponse(response)

    return result.flatMap((e) => {
      try {
        return Either.right(e.map((m) => Message.fromJson(m)))
      } catch (e) {
        return Either.left(e as DataError)
      }
    })
  }

  async createMessage({ chatId, value }: CreateMessagePayload): Promise<Either<DataError, void>> {
    const response = await this._client
      .rpc('create_message', { input_chat_id: chatId, value })
      .then()

    return this._handleResponse(response)
  }

  initialize(): void {
    this._realTimeDb.addConfig(this._realTimeDbInsertKey, {
      event: 'INSERT',
      schema: 'public',
      table: 'conversations_messages',
    })
  }

  dispose(): void {
    this._realTimeDb.removeConfig(this._realTimeDbInsertKey)
  }
}
