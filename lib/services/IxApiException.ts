export enum IxApiException {
  UNKNOWN = "Something went wrong, please try again later",
  NOT_AUTHENTICATED = "You are not logged in",

  REGISTER_INVALID_EMAIL_OR_PASSWORD = "The email or password are not valid",
  REGISTER_UNUSABLE_EMAIL = "This email cannot be used to register",

  LOGIN_INVALID_CREDENTIALS = "Email or password are incorrect",
  LOGIN_EMAIL_NOT_VERIFIED = "You must verify your email to login",

  EMAILS_RATE_LIMITED = "You requested too many emails, try again later",

  PASSWORD_RESET_USER_NOT_FOUND = "No user with the provided email has been found"
}