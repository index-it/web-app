export enum UserCreationSource {
  GOOGLE = "google",
  APPLE = "apple",
  FACEBOOK = "facebook",
  NONE = "none"
}

export interface IxUser {
  id: string,
  email: string,
  creation_timestamp: number,
  creation_source: UserCreationSource
}