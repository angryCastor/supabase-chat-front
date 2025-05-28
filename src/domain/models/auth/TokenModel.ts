import { SerializeError } from '../common/DataError'

export default class TokenModel {
  readonly accessToken: string
  readonly refreshToken: string

  constructor({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  static fromJson(json: unknown): TokenModel {
    if (
      typeof json === 'object' &&
      json !== null &&
      'access_token' in json &&
      'refresh_token' in json
    ) {
      const obj = json as { access_token: string; refresh_token: string }
      return new TokenModel({
        accessToken: obj.access_token,
        refreshToken: obj.refresh_token,
      })
    }
    throw new SerializeError('Invalid JSON for TokenModel')
  }
}
