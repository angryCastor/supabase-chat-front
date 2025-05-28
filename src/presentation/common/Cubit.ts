import { BehaviorSubject, type Observable } from 'rxjs'

export default class Cubit<T> {
  private internalState: T
  private streamController: BehaviorSubject<T>

  constructor(internalState: T) {
    this.internalState = internalState
    this.streamController = new BehaviorSubject<T>(internalState)
  }

  public get state(): T {
    return this.internalState
  }

  public get stream(): Observable<T> {
    return this.streamController.asObservable()
  }

  public emit(value: T) {
    this.internalState = value
    this.streamController.next(value)
  }
}
