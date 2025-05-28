export abstract class DataError implements Error {
  name: string
  message: string
  stack?: string | undefined

  constructor({ name, message, stack }: Error) {
    this.name = name
    this.message = message
    this.stack = stack
  }
}

export class AuthError extends DataError {
  constructor(public error: Error) {
    super(error)
  }
}

export class DataSourceError extends DataError {
  constructor(public error: Error) {
    super(error)
  }
}

export class UnexpectedError extends DataError {
  constructor(error?: Error) {
    super({
      name: 'UnexpectedError',
      message: error?.message ?? 'UnexpectedError',
      stack: error?.stack,
    })
  }
}

export class SerializeError extends DataError {
  constructor(message: string) {
    super({
      name: 'SerializeError',
      message: message,
    })
  }
}
