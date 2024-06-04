export const enum IxWelcomeAction {
  LOGIN = 'login',
  REGISTER = 'register'
}

export type IxWelcomeActionResponse = {
  action: IxWelcomeAction;
}