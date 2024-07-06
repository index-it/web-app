export const enum IxApiErrorResponse {
  UNKNOWN = 'Something went wrong, please try again later',
  NOT_AUTHENTICATED = 'You are not logged in',
  INVALID_PARAMETERS = 'The request has some invalid data',

  REGISTER_INVALID_EMAIL_OR_PASSWORD = 'The email or password are not valid',
  REGISTER_UNUSABLE_EMAIL = 'This email cannot be used to register',

  LOGIN_WITH_GOOGLE_INVALID_ID_TOKEN = 'Couldn\'t login with Google, please try again later',
  LOGIN_INVALID_CREDENTIALS = 'Email or password are incorrect',
  LOGIN_EMAIL_NOT_VERIFIED = 'You must verify your email to login',

  EMAILS_RATE_LIMITED = 'You requested too many emails, try again later',

  PASSWORD_RESET_USER_NOT_FOUND = 'No user with the provided email has been found',

  LIST_INVITATION_USER_NOT_FOUND = 'You are not logged in the correct account to accept this invitation'
}