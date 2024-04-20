export enum IxWelcomeAction {
  LOGIN = "login",
  REGISTER = "register"
}

export interface IxWelcomeActionResponse {
  action: IxWelcomeAction;
}