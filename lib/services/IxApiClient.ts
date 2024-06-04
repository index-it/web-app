import {IxApiException} from "@/lib/services/IxApiException";
import {IxWelcomeAction, IxWelcomeActionResponse} from "@/lib/models/index/IxWelcomeAction";
import {IxUser} from "@/lib/models/index/IxUser";

/**
 * Client to interact with the Index API
 */
export class IxApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Function to call when initializing the api client, mostly for react
   */
  public mount() {
    console.info('Mounted Index Api client')
  }

  /**
   * Function to call when destructing the api client, mostly for react
   */
  public unmount() {
    console.info('Unmounted Index Api client')
  }

  /**
   * Fetches the welcome action for the given `email`
   *
   * @param email
   *
   * @return the `IxWelcomeAction` for the given email, or `IxApiException` if the request fails
   */
  public getWelcomeAction = async (email: string): Promise<IxWelcomeAction | IxApiException> => {
    const res = await fetch(`${this.baseUrl}/welcome-action?` + new URLSearchParams({
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
  public registerWithEmailAndPassword = async (email: string, password: string): Promise<boolean | IxApiException> => {
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
   * @return void if login was successful, `IxApiException` otherwise
   */
  public loginWithEmailAndPassword = async (email: string, password: string): Promise<void | IxApiException> => {
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
  public sendVerificationEmail = async (email: string, password: string): Promise<boolean | IxApiException> => {
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
  public isEmailVerified = async (email: string, password: string): Promise<boolean | IxApiException> => {
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
   * @return void if email is sent, `IxApiException` otherwise
   */
  public sendPasswordForgottenEmail = async (email: string): Promise<void | IxApiException> => {
    const res = await fetch(`${this.baseUrl}/password-forgotten`+ new URLSearchParams({
      email: email
    }))

    if (res.ok) {
      return;
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
  public getLoggedInUser = async (): Promise<IxUser | IxApiException> => {
    const res = await fetch(`${this.baseUrl}/me`, {
      credentials: "include"
    })

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