import { IxApiErrorResponse } from "@/lib/services/IxApiErrorResponse";
import { IxWelcomeAction, IxWelcomeActionResponse } from "@/lib/models/index/IxWelcomeAction";
import { IxUser } from "@/lib/models/index/IxUser";
import { IxApiError } from "@/lib/models/index/core/IxApiError";
import { IxList } from "../models/index/IxList";
import ix_fetch from "@/lib/services/ix_fetch";
import { IxListUserAccess } from "@/lib/models/index/IxListUserAccess";
import { IxCategory } from "@/lib/models/index/IxCategory";
import { IxItem } from "@/lib/models/index/IxItem";

/**
 * Client to interact with the Index API
 */
export class IxApiClient {
  private readonly base_url: string;

  constructor(base_url: string) {
    this.base_url = base_url;
  }

  /// AUTH ///

  public get_welcome_action = async (email: string): Promise<IxWelcomeAction> => {
    const res = await ix_fetch(`${this.base_url}/welcome-action?` + new URLSearchParams({ email }));

    if (res.ok) {
      const welcome_action_res: IxWelcomeActionResponse = await res.json();
      return welcome_action_res.action;
    }

    throw new IxApiError(IxApiErrorResponse.UNKNOWN);
  };

  public register_with_email_and_password = async (email: string, password: string): Promise<boolean> => {
    const res = await ix_fetch(`${this.base_url}/register`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" }
    });

    if (res.ok) {
      return res.status === 200;
    }

    switch (res.status) {
      case 400:
        throw new IxApiError(IxApiErrorResponse.REGISTER_INVALID_EMAIL_OR_PASSWORD);
      case 403:
        throw new IxApiError(IxApiErrorResponse.REGISTER_UNUSABLE_EMAIL);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public login_with_email_and_password = async (email: string, password: string): Promise<void> => {
    const res = await ix_fetch(
        `${this.base_url}/login`,
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        },
        false
    );

    if (res.ok) return;

    switch (res.status) {
      case 401:
        throw new IxApiError(IxApiErrorResponse.LOGIN_INVALID_CREDENTIALS);
      case 405:
        throw new IxApiError(IxApiErrorResponse.LOGIN_EMAIL_NOT_VERIFIED);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public login_with_google = async (token_id: string): Promise<void> => {
    const res = await ix_fetch(
        `${this.base_url}/login-with-google?` + new URLSearchParams({ token_id }),
        { credentials: "include" },
        false
    );

    if (res.ok) return;

    switch (res.status) {
      case 401:
        throw new IxApiError(IxApiErrorResponse.LOGIN_WITH_GOOGLE_INVALID_ID_TOKEN);
      case 405:
        throw new IxApiError(IxApiErrorResponse.LOGIN_EMAIL_NOT_VERIFIED);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public send_verification_email = async (email: string, password: string): Promise<boolean> => {
    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    const res = await ix_fetch(`${this.base_url}/send-verification-email`, {
      method: "POST",
      body: data
    });

    if (res.ok) {
      return res.status === 201;
    }

    switch (res.status) {
      case 403:
        throw new IxApiError(IxApiErrorResponse.NOT_AUTHENTICATED);
      case 429:
        throw new IxApiError(IxApiErrorResponse.TOO_MANY_VERIFICATION_EMAILS);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public is_email_verified = async (email: string, password: string): Promise<boolean> => {
    const data = new URLSearchParams();
    data.append("email", email);
    data.append("password", password);

    const res = await ix_fetch(`${this.base_url}/is-email-verified`, {
      method: "POST",
      body: data
    });

    if (res.ok) return true;

    switch (res.status) {
      case 403:
        throw new IxApiError(IxApiErrorResponse.NOT_AUTHENTICATED);
      case 404:
        return false;
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public send_password_forgotten_email = async (email: string): Promise<void> => {
    const res = await ix_fetch(
        `${this.base_url}/password-forgotten?` + new URLSearchParams({ email })
    );

    if (res.ok) return;

    switch (res.status) {
      case 404:
        throw new IxApiError(IxApiErrorResponse.PASSWORD_RESET_USER_NOT_FOUND);
      case 429:
        throw new IxApiError(IxApiErrorResponse.TOO_MANY_PASSWORD_FORGOTTEN_EMAILS);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public reset_password_using_token = async (token: string, password: string): Promise<void> => {
    const res = await ix_fetch(
        `${this.base_url}/reset-password?` + new URLSearchParams({ token }),
        {
          method: "POST",
          body: JSON.stringify({ password }),
          headers: { "Content-Type": "application/json" }
        }
    );

    if (res.ok) return;

    switch (res.status) {
      case 400:
        throw new IxApiError(IxApiErrorResponse.REGISTER_INVALID_EMAIL_OR_PASSWORD);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public logout = async (): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/logout`, { credentials: "include" }, false);

    switch (res.status) {
      case 200:
      case 401:
        return;
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  /// USER ///

  public get_logged_in_user = async (): Promise<IxUser> => {
    const res = await ix_fetch(`${this.base_url}/me`, { credentials: "include" });

    if (res.ok) return await res.json();

    throw new IxApiError(IxApiErrorResponse.UNKNOWN);
  };

  public change_password = async (password: string): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/me/password`, {
      method: "PUT",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return;
      case 400:
        throw new IxApiError(IxApiErrorResponse.REGISTER_UNUSABLE_PASSWORD);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public delete_user = async (): Promise<void> => {
    const res = await ix_fetch(`${this.base_url}/me`, {
      method: "DELETE",
      credentials: "include"
    });

    switch (res.status) {
      case 200:
      case 401:
        return;
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  /// LISTS ///

  public get_lists = async (): Promise<IxList[]> => {
    const res = await ix_fetch(`${this.base_url}/lists`, { credentials: "include" });

    if (res.ok) return await res.json();

    throw new IxApiError(IxApiErrorResponse.UNKNOWN);
  };

  public get_list = async (list_id: string): Promise<IxList> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}`, {
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      case 404:
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public create_list = async (
      name: string,
      icon: string,
      color: string,
      is_public: boolean
  ): Promise<IxList> => {
    const res = await ix_fetch(`${this.base_url}/lists`, {
      method: "POST",
      body: JSON.stringify({ name, icon, color, public: is_public }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (res.ok) return await res.json();

    switch (res.status) {
      case 400:
        throw new IxApiError(IxApiErrorResponse.INVALID_DATA);
      case 402:
        throw new IxApiError(
            is_public
                ? IxApiErrorResponse.PRO_REQUIRED_LIST_PUBLIC
                : IxApiErrorResponse.PRO_REQUIRED_LIST_UNLIMITED
        );
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public edit_list = async (
      listId: string,
      name: string,
      icon: string,
      color: string,
      is_public: boolean
  ): Promise<IxList> => {
    const res = await fetch(`${this.base_url}/lists/${listId}`, {
      method: "PUT",
      body: JSON.stringify({ name, icon, color, public: is_public }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 400:
        throw new IxApiError(IxApiErrorResponse.INVALID_DATA);
      case 402:
        throw new IxApiError(IxApiErrorResponse.PRO_REQUIRED_LIST_PUBLIC);
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      case 404:
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public delete_list = async (list_id: string): Promise<void> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}`, {
      method: "DELETE",
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return;
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_OWNER);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  /// LIST CATEGORIES ///

  public get_categories = async (list_id: string): Promise<IxCategory[]> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories`, {
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public get_category = async (list_id: string, category_id: string): Promise<IxCategory> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories/${category_id}`, {
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      case 404:
        throw new IxApiError(IxApiErrorResponse.CATEGORY_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public create_category = async (
      list_id: string,
      name: string,
      color: string
  ): Promise<IxCategory> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories`, {
      method: "POST",
      body: JSON.stringify({ name, color }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 400:
        throw new IxApiError(IxApiErrorResponse.INVALID_DATA);
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public edit_category = async (
      list_id: string,
      category_id: string,
      name: string,
      color: string
  ): Promise<IxCategory> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories/${category_id}`, {
      method: "PUT",
      body: JSON.stringify({ name, color }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 400:
        throw new IxApiError(IxApiErrorResponse.INVALID_DATA);
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      case 404:
        throw new IxApiError(IxApiErrorResponse.CATEGORY_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public delete_category = async (list_id: string, category_id: string): Promise<void> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/categories/${category_id}`, {
      method: "DELETE",
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return;
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  /// LIST ITEMS ///

  public get_items = async (list_id: string, completed?: boolean): Promise<IxItem[]> => {
    const params = new URLSearchParams();
    if (completed !== undefined) params.append("completed", String(completed));

    const res = await fetch(`${this.base_url}/lists/${list_id}/items?${params.toString()}`, {
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public get_item = async (list_id: string, item_id: string): Promise<IxItem> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items/${item_id}`, {
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_VIEWER);
      case 404:
        throw new IxApiError(IxApiErrorResponse.ITEM_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public create_item = async (
      list_id: string,
      name: string,
      category_id: string | null,
      link: string | null
  ): Promise<IxItem> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items`, {
      method: "POST",
      body: JSON.stringify({ name, category_id, link }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 400:
        throw new IxApiError(IxApiErrorResponse.INVALID_DATA);
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public edit_item = async (
      list_id: string,
      item_id: string,
      name: string,
      category_id: string | null,
      link: string | null
  ): Promise<IxItem> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items/${item_id}`, {
      method: "PUT",
      body: JSON.stringify({ name, category_id, link }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 400:
        throw new IxApiError(IxApiErrorResponse.INVALID_DATA);
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      case 404:
        throw new IxApiError(IxApiErrorResponse.ITEM_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public set_item_completion = async (
      list_id: string,
      item_id: string,
      completed: boolean
  ): Promise<IxItem> => {
    const res = await fetch(
        `${this.base_url}/lists/${list_id}/items/${item_id}/completion?completed=${completed}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }
    );

    switch (res.status) {
      case 200:
        return await res.json();
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      case 404:
        throw new IxApiError(IxApiErrorResponse.ITEM_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public delete_item = async (list_id: string, item_id: string): Promise<void> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/items/${item_id}`, {
      method: "DELETE",
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return;
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_EDITOR);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  /// LIST SHARING ///

  public accept_list_invitation = async (token: string): Promise<IxList> => {
    const res = await ix_fetch(
        `${this.base_url}/lists/accept-invite?` + new URLSearchParams({ token }),
        { credentials: "include" }
    );

    if (res.ok) return await res.json();

    switch (res.status) {
      case 404:
      case 405:
        throw new IxApiError(IxApiErrorResponse.LIST_INVITE_EXPIRED);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public accept_list_user_invitation = async (token: string): Promise<IxList> => {
    const res = await ix_fetch(
        `${this.base_url}/lists/accept-user-invite?` + new URLSearchParams({ token }),
        { credentials: "include" }
    );

    if (res.ok) return await res.json();

    switch (res.status) {
      case 405:
        throw new IxApiError(IxApiErrorResponse.LIST_INVITATION_USER_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public get_list_users_with_access = async (list_id: string): Promise<IxListUserAccess[]> => {
    const res = await ix_fetch(`${this.base_url}/lists/${list_id}/access/users`, {
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_OWNER);
      case 404:
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public list_invite_user = async (
      list_id: string,
      email: string,
      editor: boolean
  ): Promise<IxList | null> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/access`, {
      method: "POST",
      body: JSON.stringify({ email, editor }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 201:
        return null;
      case 400:
        throw new IxApiError(IxApiErrorResponse.LIST_CANNOT_INVITE_SELF);
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_OWNER);
      case 404:
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public list_remove_user = async (list_id: string, user_id: string): Promise<IxList> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/access`, {
      method: "DELETE",
      body: JSON.stringify({ user_id }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return await res.json();
      case 403:
        throw new IxApiError(IxApiErrorResponse.LIST_MISSING_PERMISSION_OWNER);
      case 404:
        throw new IxApiError(IxApiErrorResponse.LIST_NOT_FOUND);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };

  public list_leave = async (list_id: string): Promise<void> => {
    const res = await fetch(`${this.base_url}/lists/${list_id}/access/leave`, {
      credentials: "include"
    });

    switch (res.status) {
      case 200:
        return;
      case 405:
        throw new IxApiError(IxApiErrorResponse.LIST_OWNER_CANNOT_LEAVE);
      default:
        throw new IxApiError(IxApiErrorResponse.UNKNOWN);
    }
  };
}