import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {IxWelcomeAction, IxWelcomeActionResponse} from "@/lib/models/index/IxWelcomeAction";
import {IxUser} from "@/lib/models/index/IxUser";
import {IxApiError} from "@/lib/models/index/core/IxApiError";

/**
 * Client to interact with the Index API
 */
export class IxApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetches the welcome action for the given `email`
   *
   * @param email
   *
   * @throws IxApiError
   * @return the `IxWelcomeAction` for the given email
   */
  public getWelcomeAction = async (email: string): Promise<IxWelcomeAction> => {
    const res = await fetch(`${this.baseUrl}/welcome-action?` + new URLSearchParams({
      email: email
    }))

    if (res.ok) {
      const welcomeActionRes: IxWelcomeActionResponse = await res.json()
      return welcomeActionRes.action;
    } else {
      console.error(`Failed getting welcome action: ${res.status}`)
      throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  }

  /**
   * @param email
   * @param password
   *
   * @throws IxApiError
   * @return true if the verification email has been sent, false otherwise
   */
  public registerWithEmailAndPassword = async (email: string, password: string): Promise<boolean> => {
    const res = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (res.ok) {
      return res.status === 200;
    } else {
      switch (res.status) {
        case 400: {
          throw new IxApiError(IxApiErrorResponse.REGISTER_INVALID_EMAIL_OR_PASSWORD);
        }
        case 403: {
          throw new IxApiError(IxApiErrorResponse.REGISTER_UNUSABLE_EMAIL);
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN)
        }
      }
    }
  }

  /**
   * @param email
   * @param password
   *
   * @throws IxApiError
   * @return void if login was successful
   */
  public loginWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include'
    })

    if (res.ok) {
      return;
    } else {
      switch (res.status) {
        case 401: {
          throw new IxApiError(IxApiErrorResponse.LOGIN_INVALID_CREDENTIALS);
        }
        case 405: {
          throw new IxApiError(IxApiErrorResponse.LOGIN_EMAIL_NOT_VERIFIED);
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN)
        }
      }
    }
  }

  /**
   * Sends an account verification email to the specified email
   * Requires the password to be provided too
   *
   * @param email
   * @param password
   *
   * @throws IxApiError
   * @return `true` if the verification email has been sent, `false` if the user is already verified
   */
  public sendVerificationEmail = async (email: string, password: string): Promise<boolean> => {
    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    const res = await fetch(`${this.baseUrl}/send-verification-email`, {
      method: "POST",
      body: data
    })

    if (res.ok) {
      return res.status === 201;
    } else {
      switch (res.status) {
        case 403: {
          throw new IxApiError(IxApiErrorResponse.NOT_AUTHENTICATED);
        }
        case 429: {
          throw new IxApiError(IxApiErrorResponse.EMAILS_RATE_LIMITED);
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN)
        }
      }
    }
  }

  /**
   * Checks if the user email has been verified
   *
   * @param email
   * @param password
   *
   * @throws IxApiError
   * @return `true` if the email is verified, `false` otherwise
   */
  public isEmailVerified = async (email: string, password: string): Promise<boolean> => {
    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    const res = await fetch(`${this.baseUrl}/is-email-verified`, {
      method: "POST",
      body: data
    })

    if (res.ok) {
      return true;
    } else {
      switch (res.status) {
        case 403: {
          throw new IxApiError(IxApiErrorResponse.NOT_AUTHENTICATED);
        }
        case 404: {
          return false;
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN)
        }
      }
    }
  }

  /**
   * Sends an email to reset the password of a user with the specified `email`
   *
   * @param email
   *
   * @throws IxApiError
   * @return void if email is sent
   */
  public sendPasswordForgottenEmail = async (email: string): Promise<void> => {
    const res = await fetch(`${this.baseUrl}/password-forgotten?`+ new URLSearchParams({
      email: email
    }))

    if (res.ok) {
      return;
    } else {
      switch (res.status) {
        case 404: {
          throw new IxApiError(IxApiErrorResponse.PASSWORD_RESET_USER_NOT_FOUND);
        }
        case 429: {
          throw new IxApiError(IxApiErrorResponse.EMAILS_RATE_LIMITED);
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN);
        }
      }
    }
  }

  /**
   * Resets the user password using a one time authentication token
   * 
   * @param token the token to authenticate the password reset usually passed from the email as a query parameter
   * @param password the new password of the user
   * @throws IxApiError
   */
  public resetPasswordUsingToken = async (token: string, password: string): Promise<void> => {
    const res = await fetch(`${this.baseUrl}/reset-password?`+ new URLSearchParams({ token: token }),
    {
      method: "POST",
      body: JSON.stringify({
        password: password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (res.ok) {
      return;
    } else {
      switch (res.status) {
        case 400: {
          throw new IxApiError(IxApiErrorResponse.REGISTER_INVALID_EMAIL_OR_PASSWORD);
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN)
        }
      }
    }
  }

  /**
   * Gets the currently logged-in user by using the automatically stored cookies
   *
   * @throws IxApiError
   * @return `IxUser` if logged in
   */
  public getLoggedInUser = async (): Promise<IxUser> => {
    const res = await fetch(`${this.baseUrl}/me`, {
      credentials: "include"
    })

    if (res.ok) {
      return await res.json()
    } else {
      switch (res.status) {
        case 401: {
          throw new IxApiError(IxApiErrorResponse.NOT_AUTHENTICATED);
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN);
        }
      }
    }
  }
}