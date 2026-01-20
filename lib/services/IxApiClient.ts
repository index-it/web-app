import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {IxWelcomeAction, IxWelcomeActionResponse} from "@/lib/models/index/IxWelcomeAction";
import {IxUser} from "@/lib/models/index/IxUser";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxList} from "../models/index/IxList";
import ix_fetch from "@/lib/services/ix_fetch";
import {IxListUserAccess} from "@/lib/models/index/IxListUserAccess";
import {IxCategory} from "@/lib/models/index/IxCategory";
import {IxItem} from "@/lib/models/index/IxItem";
import {IxItemContent} from "@/lib/models/index/IxItemContent";

/**
 * Client to interact with the Index API
 */
export class IxApiClient {
  private readonly base_url: string;


  constructor(base_url: string) {
    this.base_url = base_url;
  }


  /// AUTH ///
  /**
   * Fetches the welcome action for the given `email`
   *
   * @param email
   *
   * @throws IxApiError
   * @return the `IxWelcomeAction` for the given email
   */
  public get_welcome_action = async (email: string): Promise<IxWelcomeAction> => {
    const res = await ix_fetch(`${this.base_url}/welcome-action?` + new URLSearchParams({
      email: email
    }))

    if (res.ok) {
      const welcome_action_res: IxWelcomeActionResponse = await res.json()
      return welcome_action_res.action;
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
  public register_with_email_and_password = async (email: string, password: string): Promise<boolean> => {
    const res = await ix_fetch(`${this.base_url}/register`, {
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
  public login_with_email_and_password = async (email: string, password: string): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/login`,
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password
        }),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
      },
      false
    )

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
   * Logs in a user using Google OAuth
   * 
   * @param token_id the token id received from the google auth flow
   * @throws IxApiError
   */
  public login_with_google = async (token_id: string): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/login-with-google?` + new URLSearchParams({
      token_id: token_id
    }),
      {
        credentials: 'include'
      },
      false
    )

    if (res.ok) {
      return;
    } else {
      switch (res.status) {
        case 401: {
          throw new IxApiError(IxApiErrorResponse.LOGIN_WITH_GOOGLE_INVALID_ID_TOKEN);
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
  public send_verification_email = async (email: string, password: string): Promise<boolean> => {
    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    const res = await ix_fetch(`${this.base_url}/send-verification-email`, {
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
  public is_email_verified = async (email: string, password: string): Promise<boolean> => {
    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    const res = await ix_fetch(`${this.base_url}/is-email-verified`, {
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
  public send_password_forgotten_email = async (email: string): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/password-forgotten?`+ new URLSearchParams({
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
  public reset_password_using_token = async (token: string, password: string): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/reset-password?`+ new URLSearchParams({ token: token }),
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
   * Logs out the current user
   *
   * @throws IxApiError
   */
  public logout = async (): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/logout`, {
      credentials: "include"
    }, false)

    switch (res.status) {
      case 200: {
        return
      }
      case 401: {
        // already logged out
        return
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }


  /// USER ///
  /**
   * Gets the currently logged-in user by using the automatically stored cookies
   *
   * @throws IxApiError
   * @return `IxUser` if logged-in
   */
  public get_logged_in_user = async (): Promise<IxUser> => {
    const res = await ix_fetch(`${this.base_url}/me`, {
      credentials: "include"
    })

    if (res.ok) {
      return await res.json()
    } else {
      switch (res.status) {
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN);
        }
      }
    }
  }

  // TODO: Firebase notification registration

  /**
   * Changes the user password
   *
   * @throws IxApiError
   */
  public change_password = async (password: string): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/`, {
      method: "PUT",
      body: JSON.stringify({
        password: password
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return
      }
      case 400: {
        throw new IxApiError(IxApiErrorResponse.USER_INVALID_PASSWORD);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Permanently deletes the logged-in user with all of its data
   *
   * @throws IxApiError
   */
  public delete_user = async (): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/me`, {
      method: "DELETE",
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /// LISTS ///
  /**
   * @returns the lists of the logged-in user, both the ones he owns and the ones he has access to as editor or viewer
   */
  public get_lists = async (): Promise<IxList[]> => {
    const res = await ix_fetch(`${this.base_url}/lists`, {
      credentials: "include"
    })

    if (res.ok) {
      return await res.json()
    } else {
      switch (res.status) {
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN);
        }
      }
    }
  }

  /**
   * Gets a single list
   *
   * @param list_id
   *
   * @throws IxApiError
   */
  public get_list = async (list_id: string): Promise<IxList> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}`, {
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * @param name name of the list, 1-100 characters
   * @param icon a valid emoji
   * @param color an hex color (#000000)
   * @param is_public a boolean indicating whether the list is public
   * 
   * @throws IxApiError
   * @returns the created list
   */
  public create_list = async (name: string, icon: string, color: string, is_public: boolean): Promise<IxList> => {
    const res = await ix_fetch(`${this.base_url}/lists`,
    {
      method: "POST",
      body: JSON.stringify({
        name: name,
        icon: icon,
        color: color,
        public: is_public
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    if (res.ok) {
      return await res.json()
    } else {
      switch (res.status) {
        case 400: {
          throw new IxApiError(IxApiErrorResponse.INVALID_PARAMETERS);
        }
        case 402: {
          if (is_public) {
            throw new IxApiError(IxApiErrorResponse.PRO_REQUIRED_LIST_PUBLIC);
          } else {
            throw new IxApiError(IxApiErrorResponse.PRO_REQUIRED_LIST_UNLIMITED);
          }
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN);
        }
      }
    }
  }

  /**
   * Updates a list
   *
   * @param listId
   * @param name
   * @param icon
   * @param color
   * @param is_public
   *
   * @throws IxApiError
   */
  public edit_list = async (listId: string, name: string, icon: string, color: string, is_public: boolean): Promise<IxList> => {
    const res = await fetch(`${this.base_url}/lists/${listId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: name,
        icon: icon,
        color: color,
        "public": is_public
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 400: {
        throw new IxApiError(IxApiErrorResponse.INVALID_PARAMETERS);
      }
      case 402: {
        throw new IxApiError(IxApiErrorResponse.PRO_REQUIRED_LIST_PUBLIC);
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Deletes a list and all of its content
   *
   * @param list_id
   *
   * @throws IxApiError
   */
  public delete_list = async (list_id: string): Promise<void> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}`, {
      method: "DELETE",
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_OWNER);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }


  /// LIST CATEGORIES ///
  /**
   * Gets the categories of a list
   *
   * @param list_id
   *
   * @throws IxApiError
   */
  public get_categories = async (list_id: string): Promise<IxCategory[]> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories`, {
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Gets a category of a list
   *
   * @param list_id
   * @param category_id
   *
   * @throws IxApiError
   */
  public get_category = async (list_id: string, category_id: string): Promise<IxCategory> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories/${category_id}`, {
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.CATEGORY_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Creates a category in a list
   *
   * @param list_id
   * @param name
   * @param color
   *
   * @throws IxApiError
   */
  public create_category = async (list_id: string, name: string, color: string): Promise<IxCategory> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        color: color
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 400: {
        throw new IxApiError(IxApiErrorResponse.INVALID_PARAMETERS);
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Update a category
   *
   * @param list_id
   * @param category_id
   * @param name
   * @param color
   *
   * @throws IxApiError
   */
  public edit_category = async (list_id: string, category_id: string, name: string, color: string): Promise<IxCategory> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories/${category_id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: name,
        color: color
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 400: {
        throw new IxApiError(IxApiErrorResponse.INVALID_PARAMETERS);
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.CATEGORY_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Deletes a category
   *
   * @param list_id
   * @param category_id
   *
   * @throws IxApiError
   */
  public delete_category = async (list_id: string, category_id: string): Promise<void> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories/${category_id}`, {
      method: "DELETE",
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }


  /// LIST ITEMS ///

  /**
   * Gets the items of a list
   *
   * @param list_id
   * @param completed true to filter for completed items, false to filter uncompleted, undefined to get all
   *
   * @throws IxApiError
   */
  public get_items = async (list_id: string, completed: boolean | undefined): Promise<IxItem[]> => {
    const res = await fetch(
      `${this.base_url}/lists/${list_id}/items?`
        + (completed !== undefined ? new URLSearchParams({ completed: completed ? 'true' : 'false' }) : ''),
      {
        credentials: "include"
      })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Get a single item
   *
   * @param list_d
   * @param item_id
   *
   * @throws IxApiError
   */
  public get_item = async (list_d: string, item_id: string): Promise<IxItem> => {
    const res = await fetch(
      `${this.base_url}/lists/${list_d}/items/${item_id}`, {
        credentials: "include"
      })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.ITEM_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Creates an item in a list
   *
   * @param list_id
   * @param name
   * @param category_id
   * @param link
   *
   * @throws IxApiError
   */
  public create_item = async (
    list_id: string,
    name: string,
    category_id: string | null,
    link: string | null
  ): Promise<IxItem> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        category_id: category_id,
        link: link
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 400: {
        throw new IxApiError(IxApiErrorResponse.INVALID_PARAMETERS);
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Updates an item
   *
   * @param list_id
   * @param item_id
   * @param name
   * @param category_id
   * @param link
   *
   * @throws IxApiError
   */
  public edit_item = async (
    list_id: string,
    item_id: string,
    name: string,
    category_id: string | null,
    link: string | null
  ): Promise<IxItem> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items/${item_id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: name,
        category_id: category_id,
        link: link
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 400: {
        throw new IxApiError(IxApiErrorResponse.INVALID_PARAMETERS);
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.ITEM_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Sets an item as completed or uncompleted
   *
   * @param list_id
   * @param item_id
   * @param completed
   *
   * @throws IxApiError
   */
  public set_item_completion = async (
    list_id: string,
    item_id: string,
    completed: boolean
  ): Promise<IxItem> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items/${item_id}/completion?` + new URLSearchParams({ completed: completed ? 'true' : 'false' }), {
      method: "PUT",
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.ITEM_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Deletes an item
   *
   * @param list_id
   * @param item_id
   *
   * @throws IxApiError
   */
  public delete_item = async (list_id: string, item_id: string): Promise<void> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items/${item_id}`, {
      method: "DELETE",
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }


  /// ITEM CONTENT ///

  /**
   * Gets the content of an item
   *
   * @param list_id
   * @param item_id
   *
   * @throws IxApiError
   */
  public get_item_content = async (list_id: string, item_id: string): Promise<IxItemContent> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items/${item_id}/content`, {
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.ITEM_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Updates the content of an item
   *
   * @param list_id
   * @param item_id
   * @param content
   *
   * @throws IxApiError
   */
  public edit_item_content = async (list_id: string, item_id: string, content: string): Promise<IxItemContent> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items/${item_id}/content`, {
      method: "PUT",
      body: JSON.stringify({
        content: content
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 400: {
        throw new IxApiError(IxApiErrorResponse.INVALID_PARAMETERS);
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.ITEM_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /// LISTS SHARING ///
  /**
   *
   * @param token the token to authenticate the invitation acceptance
   * @throws IxApiError
   * @returns void if the invitation is successfully accepted
   */
  public accept_list_invitation = async (token: string): Promise<IxList> => {
    const res = await ix_fetch(`${this.base_url}/lists/accept-invite?`+ new URLSearchParams({ token: token }), {
      credentials: "include"
    })

    if (res.ok) {
      return await res.json()
    } else {
      switch (res.status) {
        case 404: {
          throw new IxApiError(IxApiErrorResponse.LIST_INVITE_EXPIRED);
        }
        case 405: {
          throw new IxApiError(IxApiErrorResponse.LIST_INVITE_EXPIRED);
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN);
        }
      }
    }
  }

  /**
   * 
   * @param token the token to authenticate the invitation acceptance
   * @throws IxApiError
   * @returns void if the invitation is successfully accepted
   */
  public accept_list_user_invitation = async (token: string): Promise<IxList> => {
    const res = await ix_fetch(`${this.base_url}/lists/accept-user-invite?`+ new URLSearchParams({ token: token }), {
      credentials: "include"
    })

    if (res.ok) {
      return await res.json()
    } else {
      switch (res.status) {
        case 405: {
          throw new IxApiError(IxApiErrorResponse.LIST_INVITATION_USER_NOT_FOUND);
        }
        default: {
          throw new IxApiError(IxApiErrorResponse.UNKNOWN);
        }
      }
    }
  }

  /**
   * Gets information about the users that have access to the list
   *
   * @param list_id
   *
   * @throws IxApiError
   */
  public get_list_users_with_access = async (list_id: string): Promise<IxListUserAccess[]> => {
    const res = await ix_fetch(`${this.base_url}/lists/${list_id}/access/users`, {
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_OWNER)
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND)
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Invites a user to be a viewer or editor on a list
   *
   * @param list_id
   * @param email of the user to invite
   * @param editor
   *
   * @return null if the user was invited, or the updated list data if the user permissions were update (the user already accepted an invitation previously and already had some permissions on the list)
   *
   * @throws IxApiError
   */
  public list_invite_user = async (list_id: string, email: string, editor: boolean): Promise<IxList | null> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/access`, {
      method: "POST",
      body: JSON.stringify({
        "email": email,
        "editor": editor
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 201: {
        return null
      }
      case 400: {
        throw new IxApiError(IxApiErrorResponse.LIST_CANNOT_INVITE_SELF);
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_OWNER)
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND)
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Removes a user access from a list
   *
   * @param list_id
   * @param user_id of the user to remove from the list
   *
   * @throws IxApiError
   */
  public list_remove_user = async (list_id: string, user_id: string): Promise<IxList> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/access`, {
      method: "DELETE",
      body: JSON.stringify({
        user_id: user_id
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return await res.json()
      }
      case 403: {
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_OWNER);
      }
      case 404: {
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }

  /**
   * Leaves a list if the logged-in user is either a viewer or editor on it
   *
   * @param list_id
   * @throws IxApiError
   */
  public list_leave = async (list_id: string): Promise<void> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/access/leave`, {
      credentials: "include"
    })

    switch (res.status) {
      case 200: {
        return
      }
      case 405: {
        throw new IxApiError(IxApiErrorResponse.LIST_OWNER_CANNOT_LEAVE);
      }
      default: {
        throw new IxApiError(IxApiErrorResponse.UNKNOWN)
      }
    }
  }
}