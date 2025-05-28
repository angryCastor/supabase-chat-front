<script setup lang="ts">
import type Message from '@/domain/models/message/Message'
import type User from '@/domain/models/user/user'
import { onMounted, onUnmounted, ref, watch, type DeepReadonly, type Ref } from 'vue'
import ChatMessageItem from './ChatMessageItem.vue'
import ChatError from './ChatError.vue'
import {
  DynamicScroller,
  DynamicScrollerItem,
  type RecycleScrollerInstance,
} from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { BehaviorSubject, bufferCount, distinctUntilChanged, filter, map } from 'rxjs'

export interface ChatMessageListProps {
  messages: DeepReadonly<Message[]>
  users: DeepReadonly<User[]>
  me: User
  canLoadMore?: boolean
  loadMoreLoading?: boolean
}

const modifyItems = (messages: DeepReadonly<Message[]>, users: DeepReadonly<User[]>, me: User) => {
  return messages.map((e, i) => ({
    ...e,
    isSelf: e.userId === me.id,
    user: users.find((u) => u.id === e.userId),
    isUserPreview: e.userId === messages[i - 1]?.userId,
  }))
}

let beforeLoadItemTopId: number | null = null
const emit = defineEmits(['loadMore'])
const props = defineProps<ChatMessageListProps>()

const subjectVisibleItemIndex = new BehaviorSubject(0)
const scroller: Ref<RecycleScrollerInstance | undefined> = ref()
const items = ref(modifyItems(props.messages, props.users, props.me))

const $scrollToTop = subjectVisibleItemIndex.pipe(
  distinctUntilChanged(),
  bufferCount(2, 1),
  map((e) => {
    if (e[1] != 1) {
      return false
    }
    return e[0] > 1
  }),
  filter((e) => e),
)

watch(
  () => props.messages,
  (value) => {
    items.value = modifyItems(value, props.users, props.me)
    if (beforeLoadItemTopId) {
      const index = items.value.findIndex((e) => e.id === beforeLoadItemTopId)
      scroller.value?.scrollToItem(index)
      beforeLoadItemTopId = null
    }
  },
)

const subscription = $scrollToTop.subscribe(() => {
  beforeLoadItemTopId = items.value[0].id
  emit('loadMore')
})

const updateHandler = (_: number, __: number, visibleIndex: number) => {
  subjectVisibleItemIndex.next(visibleIndex)
}

onMounted(() => {
  scroller.value?.scrollToBottom()
})

onUnmounted(() => {
  subscription.unsubscribe()
})
</script>

<template>
  <DynamicScroller
    v-if="messages.length > 0"
    ref="scroller"
    :items="items"
    :min-item-size="56"
    :emit-update="true"
    class="scroller"
    :buffer="0"
    @update="updateHandler"
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.value, item.user, item.isUserPreview]"
        :data-index="index"
        :data-active="active"
        :watch-data="true"
      >
        <ChatMessageItem
          :message="item"
          :is-self="item.isSelf"
          :user="item.user"
          :is-user-preview="item.isUserPreview"
        />
      </DynamicScrollerItem>
    </template>
    <template #after>
      <div>
        <div class="h-2"></div>
      </div>
    </template>
  </DynamicScroller>

  <ChatError v-else error="Сообщений еще нет" />
</template>

<style>
.scroller * {
  overflow-anchor: none;
}

.scroller > div:nth-child(3) {
  overflow-anchor: auto;
}
</style>
