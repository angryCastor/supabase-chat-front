export default function throttle<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timerFlag: NodeJS.Timeout | null = null

  return (...args: Parameters<T>): void => {
    if (timerFlag === null) {
      fn(...args)
      timerFlag = setTimeout(() => {
        timerFlag = null
      }, delay)
    }
  }
}
