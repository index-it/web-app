export const enum UserCreationSource {
  GOOGLE = 'google',
  APPLE = 'apple',
  FACEBOOK = 'facebook',
  NONE = 'none'
}

export type IxUser = {
  id: string,
  email: string,
  creation_timestamp: number,
  creation_source: UserCreationSource
}