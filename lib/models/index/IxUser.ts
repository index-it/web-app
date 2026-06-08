export const enum UserCreationSource {
  GOOGLE = 'google',
  APPLE = 'apple',
  NONE = 'none'
}

export type IxUser = {
  id: string,
  email: string,
  has_pro: boolean,
  creation_timestamp: number,
  creation_source: UserCreationSource
}