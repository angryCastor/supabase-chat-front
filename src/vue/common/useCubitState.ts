import type Cubit from '@/presentation/common/Cubit'
import type { Subscription } from 'rxjs'
import { onMounted, onUnmounted, readonly, ref, type DeepReadonly, type Ref } from 'vue'

export function useCubitState<S>(cubit: Cubit<S>): DeepReadonly<Ref<S>> {
  const state = ref(cubit.state) as Ref<S>
  let subscription: Subscription

  const stateSubscription = (newState: S) => {
    state.value = newState
  }

  onMounted(() => {
    subscription = cubit.stream.subscribe(stateSubscription)
  })

  onUnmounted(() => {
    subscription.unsubscribe()
  })

  return readonly(state)
}
