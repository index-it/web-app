export const enum IxApiErrorResponse {
  UNKNOWN = 'Oh no something went terribly wrong, please try again later or contact Support',
  INVALID_DATA = 'You entered some invalid values, please double check!',
  NETWORK_ERROR = 'A network error occurred. Please check your internet connection',
  TOO_MANY_REQUESTS = 'Too many requests. Please wait a moment and try again',

  NOT_AUTHENTICATED = 'You must be logged in to perform this action',

  EMAIL_OR_PASSWORD_FORMAT_INVALID = 'The email or password format is invalid',
  UNUSABLE_EMAIL = 'The email you provided is not allowed to register, please use another email',
  EMAIL_NOT_VERIFIED = 'Your email address has not been verified. Please check your inbox and verify it to continue',

  TOO_MANY_VERIFICATION_EMAILS =
      'You have requested too many verification emails, please check your spam folder for any previous email from us, consider checking your spam too!',
  TOO_MANY_PASSWORD_FORGOTTEN_EMAILS =
      "You requested too many password resets, please check the spam folder of your inbox if you can't find the email we sent you previously",
  PASSWORD_RESET_USER_NOT_FOUND = 'No user with the provided email has been found',

  REGISTER_INVALID_EMAIL_OR_PASSWORD = 'The email or password format is invalid',
  REGISTER_UNUSABLE_EMAIL = 'The email you provided is not allowed to register, please use another email',
  REGISTER_UNUSABLE_PASSWORD = "This password is not secure enough",

  LOGIN_WITH_GOOGLE_INVALID_ID_TOKEN =
      "Couldn't login with Google, please try again later",
  LOGIN_INVALID_CREDENTIALS = 'Email or password are incorrect',
  LOGIN_EMAIL_NOT_VERIFIED =
      'Your email address has not been verified. Please check your inbox and verify it to continue',

  LIST_NOT_FOUND = 'List not found',
  CATEGORY_NOT_FOUND = 'Category not found',
  ITEM_NOT_FOUND = 'Item not found',

  LIST_CANNOT_INVITE_SELF = 'You cannot invite yourself to the list',
  LIST_OWNER_CANNOT_LEAVE = 'Only the owner of the list can perform this action',
  LIST_INVITE_EXPIRED = 'This list invite link has expired',
  LIST_INVITATION_USER_NOT_FOUND =
      'You are not logged in the correct account to accept this invitation',

  LIST_MISSING_PERMISSION_VIEWER = "You don't have permissions to view this list",
  LIST_MISSING_PERMISSION_EDITOR = "You don't have permissions to edit this list",
  LIST_MISSING_PERMISSION_OWNER = 'Only the owner of the list can perform this action',

  PRO_REQUIRED_LIST_PUBLIC = 'Pro is required to make public lists',
  PRO_REQUIRED_LIST_UNLIMITED = 'Pro is required to create more than 10 lists',
}