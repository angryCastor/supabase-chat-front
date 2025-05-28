export default function debounce<T extends (...args: unknown[]) => void>(fn: T, delay = 300) {
  let timer: NodeJS.Timeout

  return (...args: Parameters<T>): void => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
