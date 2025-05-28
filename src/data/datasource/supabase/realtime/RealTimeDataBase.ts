import type { IDisposable } from '@/domain/models/common/IDisposable'
import {
  type REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  type RealtimeChannel,
  type RealtimePostgresChangesFilter,
  type RealtimePostgresInsertPayload,
  type SupabaseClient,
} from '@supabase/supabase-js'
import { Observable, Subject } from 'rxjs'

type InsertFilter =
  RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT}`>

interface InsertPayload {
  payload: RealtimePostgresInsertPayload<{ [key: string]: unknown }>
  key: string | symbol
}

export default class RealTimeDataBase implements IDisposable {
  private readonly _client: SupabaseClient
  private readonly _streamController: Subject<InsertPayload>

  private _realtimeChannel?: RealtimeChannel | null
  private _config: Map<string | symbol, InsertFilter>

  constructor(client: SupabaseClient) {
    this._client = client
    this._streamController = new Subject()
    this._config = new Map()
  }

  get stream(): Observable<InsertPayload> {
    return this._streamController.asObservable()
  }

  addConfig(key: string | symbol, filter: InsertFilter) {
    this._config.set(key, filter)
    this.initialize()
  }

  removeConfig(key: string | symbol) {
    this._config.delete(key)
    this.initialize()
  }

  initialize(): void {
    this._realtimeChannel?.unsubscribe()
    this._realtimeChannel = null

    if (this._config.size === 0) {
      return
    }

    this._realtimeChannel = this._client.channel('schema-db-changes')

    this._config.forEach((filter, key) => {
      this._realtimeChannel?.on('postgres_changes', filter, (payload) => {
        this._streamController.next({ payload, key })
      })
    })

    this._realtimeChannel.subscribe()
  }

  dispose(): void {
    this._config.clear()
    this._realtimeChannel?.unsubscribe()
  }
}
