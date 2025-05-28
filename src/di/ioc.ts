import { Container, type Factory, type ResolutionContext } from 'inversify'
import {
  vueRouterKey,
  authRepositoryKey,
  chatRepositoryKey,
  userRepositoryKey,
  messageRepositoryKey,
} from './keys'
import type { Router } from 'vue-router'
import { SupabaseClient } from '@supabase/supabase-js'
import { SupaDataSource } from '@/data/datasource/supabase'
import AuthRepositoryRemote from '@/data/repository/AuthRepositoryRemote'
import UserRepositoryRemote from '@/data/repository/UserRepositoryRemote'
import ChatRepositoryRemote from '@/data/repository/ChatRepositoryRemote'
import AuthCubit from '@/presentation/auth/AuthCubit'
import LoginCubit from '@/presentation/auth/login/LoginCubit'
import RegistrationCubit from '@/presentation/auth/registration/RegistrationCubit'
import ChatListCubit from '@/presentation/chat/chatList/ChatListCubit'
import UserCubit from '@/presentation/user/UserCubit'
import CreatePrivateChatCubit from '@/presentation/chat/createPrivateChat/CreatePrivateChatCubit'
import CreateGroupChatCubit from '@/presentation/chat/createGroupChat/CreateGroupChatCubit'
import ChatDetailCubit from '@/presentation/chat/chatDetail/ChatDetailCubit'
import MessageRepositoryRemote from '@/data/repository/MessageRepositoryRemote'

const ioc = new Container()

ioc
  .bind<SupabaseClient>(SupabaseClient)
  .toConstantValue(
    new SupabaseClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY),
  )

ioc.bind(SupaDataSource).toSelf().inSingletonScope()
ioc.bind(authRepositoryKey).to(AuthRepositoryRemote).inSingletonScope()
ioc.bind(chatRepositoryKey).to(ChatRepositoryRemote).inSingletonScope()
ioc.bind(userRepositoryKey).to(UserRepositoryRemote).inSingletonScope()
ioc.bind(messageRepositoryKey).to(MessageRepositoryRemote).inSingletonScope()
ioc.bind(AuthCubit).toSelf().inSingletonScope()
ioc.bind(LoginCubit).toSelf().inTransientScope()
ioc.bind(RegistrationCubit).toSelf().inTransientScope()
ioc.bind(ChatListCubit).toSelf().inSingletonScope()
ioc.bind(UserCubit).toSelf().inTransientScope()
ioc.bind(CreatePrivateChatCubit).toSelf().inTransientScope()
ioc.bind(CreateGroupChatCubit).toSelf().inTransientScope()
ioc
  .bind<Factory<(chatId: number) => ChatDetailCubit, []>>(ChatDetailCubit)
  .toFactory((i: ResolutionContext) => {
    return () => (chatId: number) =>
      ChatDetailCubit.fromChatId(
        chatId,
        i.get(chatRepositoryKey),
        i.get(userRepositoryKey),
        i.get(messageRepositoryKey),
      )
  })

import router from '../vue/router'
ioc.bind<Router>(vueRouterKey).toConstantValue(router)

export { ioc }
