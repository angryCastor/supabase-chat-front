import { SupabaseClient } from '@supabase/supabase-js'
import AuthDataSource from './parts/AuthDataSource'
import { inject } from 'inversify'
import ChatDataSource from './parts/ChatDataSource'
import UserDataSource from './parts/UserDataSource'
import MessageDataSource from './parts/MessageDataSource'
import RealTimeDataBase from './realtime/RealTimeDataBase'

export class SupaDataSource {
  public readonly auth: AuthDataSource
  public readonly chat: ChatDataSource
  public readonly user: UserDataSource
  public readonly message: MessageDataSource

  constructor(@inject(SupabaseClient) client: SupabaseClient) {
    const readTimeDb = new RealTimeDataBase(client)
    this.auth = new AuthDataSource(client)
    this.chat = new ChatDataSource(client, readTimeDb)
    this.user = new UserDataSource(client)
    this.message = new MessageDataSource(client, readTimeDb)
  }
}
