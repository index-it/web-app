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

  USER_INVALID_PASSWORD = "This password is not secure enough",

  PRO_REQUIRED_LIST_PUBLIC = "Pro is required to make public lists",
  PRO_REQUIRED_LIST_UNLIMITED = "Pro is required to create more than 10 lists",

  LIST_NOT_FOUND = "This list doesn't exist anymore",
  LIST_CANNOT_INVITE_SELF = "You cannot invite yourself to the list",
  LIST_OWNER_CANNOT_LEAVE = "You cannot leave a list that you own",
  LIST_INVITATION_USER_NOT_FOUND = 'You are not logged in the correct account to accept this invitation',
  LIST_MISSING_PERMISSION_VIEWER = "You don't have permissions to view this list",
  LIST_MISSING_PERMISSION_EDITOR = "You need edit permissions on the list to perform this action",
  LIST_MISSING_PERMISSION_OWNER = "You need to be the list owner to perform this action",

  CATEGORY_NOT_FOUND = "This category doesn't exist anymore",

  ITEM_NOT_FOUND = "This item doesn't exist anymore",
}