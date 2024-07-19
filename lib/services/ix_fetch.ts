import {redirect_to_login} from "@/lib/utils";

const ix_fetch = async (
  url: string | URL | Request,
  init?: RequestInit | undefined,
  redirect_on_401: boolean = true,
): Promise<Response> => {
  const response = await fetch(url, init);

  if (response.status === 401 && redirect_on_401) {
    if (redirect_on_401) {
      redirect_to_login()
    }
    return Promise.reject(new Error('Unauthorized, redirected to login'));
  }

  return response;
};

export default ix_fetch;