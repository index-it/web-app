export const enum IxWelcomeAction {
  REGISTER = 'register',
  LOGIN = 'login'
}

export type IxWelcomeActionResponse = {
  action: IxWelcomeAction;
}