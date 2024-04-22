import {IxApiException} from "@/lib/services/IxApiException";
import {IxWelcomeAction, IxWelcomeActionResponse} from "@/lib/models/index/IxWelcomeAction";
import {IxUser} from "@/lib/models/index/IxUser";

/**
 * Client to interact with the Index API
 */
export class IxApiClient {
  private static BASE_URL = "https://api.index-it.app"

  /**
   * Fetches the welcome action for the given `email`
   *
   * @param email
   *
   * @return the `IxWelcomeAction` for the given email, or null if the request fails
   */
  public static async getWelcomeAction(email: string): Promise<IxWelcomeAction | IxApiException> {
    const res = await fetch(`${this.BASE_URL}/welcome-action?` + new URLSearchParams({
      email: email
    }))

    if (res.ok) {
      const welcomeActionRes: IxWelcomeActionResponse = await res.json()
      return welcomeActionRes.action;
    } else {
      console.error(`Failed getting welcome action: ${res.status}`)
      return IxApiException.UNKNOWN;
    }
  }

  /**
   * @param email
   * @param password
   *
   * @return true if the verification email has been sent, false otherwise or `IxApiException` for any issue
   */
  public static async registerWithEmailAndPassword(email: string, password: string): Promise<boolean | IxApiException> {
    const res = await fetch(`${this.BASE_URL}/register`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    if (res.ok) {
      return res.status === 200;
    } else {
      switch (res.status) {
        case 400: {
          return IxApiException.REGISTER_INVALID_EMAIL_OR_PASSWORD;
        }
        case 403: {
          return IxApiException.REGISTER_UNUSABLE_EMAIL;
        }
        default: {
          return IxApiException.UNKNOWN
        }
      }
    }
  }

  /**
   * @param email
   * @param password
   *
   * @return null if login was successful, `IxApiException` otherwise
   */
  public static async loginWithEmailAndPassword(email: string, password: string): Promise<null | IxApiException> {
    const res = await fetch(`${this.BASE_URL}/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    if (res.ok) {
      return null;
    } else {
      switch (res.status) {
        case 401: {
          return IxApiException.LOGIN_INVALID_CREDENTIALS;
        }
        case 405: {
          return IxApiException.LOGIN_EMAIL_NOT_VERIFIED;
        }
        default: {
          return IxApiException.UNKNOWN
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
   * @return `true` if the verification email has been sent, `false` if the user is already verified
   */
  public static async sendVerificationEmail(email: string, password: string): Promise<boolean | IxApiException> {
    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    const res = await fetch(`${this.BASE_URL}/send-verification-email`, {
      method: "POST",
      body: data
    })

    if (res.ok) {
      return res.status === 201;
    } else {
      switch (res.status) {
        case 403: {
          return IxApiException.NOT_AUTHENTICATED;
        }
        case 429: {
          return IxApiException.EMAILS_RATE_LIMITED;
        }
        default: {
          return IxApiException.UNKNOWN
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
   * @return `true` if the email is verified, `false` otherwise
   */
  public static async isEmailVerified(email: string, password: string): Promise<boolean | IxApiException> {
    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    const res = await fetch(`${this.BASE_URL}/is-email-verified`, {
      method: "POST",
      body: data
    })

    if (res.ok) {
      return true;
    } else {
      switch (res.status) {
        case 403: {
          return IxApiException.NOT_AUTHENTICATED;
        }
        case 404: {
          return false;
        }
        default: {
          return IxApiException.UNKNOWN
        }
      }
    }
  }

  /**
   * Sends an email to reset the password of a user with the specified `email`
   *
   * @param email
   *
   * @return null if email is sent, `IxApiException` otherwise
   */
  public static async sendPasswordForgottenEmail(email: string): Promise<null | IxApiException> {
    const res = await fetch(`${this.BASE_URL}/password-forgotten`+ new URLSearchParams({
      email: email
    }))

    if (res.ok) {
      return null;
    } else {
      switch (res.status) {
        case 404: {
          return IxApiException.PASSWORD_RESET_USER_NOT_FOUND;
        }
        case 429: {
          return IxApiException.EMAILS_RATE_LIMITED;
        }
        default: {
          return IxApiException.UNKNOWN
        }
      }
    }
  }

  /**
   * Gets the currently logged-in user by using the automatically stored cookies
   *
   * @return `IxUser` if logged in, `IxApiException` otherwise
   */
  public static async getLoggedInUser(): Promise<IxUser | IxApiException> {
    const res = await fetch(`${this.BASE_URL}/me`, {})

    if (res.ok) {
      return await res.json()
    } else {
      switch (res.status) {
        case 401: {
          return IxApiException.NOT_AUTHENTICATED;
        }
        default: {
          return IxApiException.UNKNOWN;
        }
      }
    }
  }
}