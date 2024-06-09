export type GoogleOAuthCodeExchangeResponse = {
  id_token: string
}

export class GoogleOAuthClient {
  /**
   * Exchange a Google OAuth code for an ID token
   * 
   * @param code the oauth code
   * @param client_id 
   * @param client_secret 
   * @param redirect_uri 
   * @throws Error
   * @returns the id token
   */
  public exchangeCodeForIdToken = async (code: string, client_id: string, client_secret: string, redirect_uri: string, ): Promise<string> => {
    const res = await fetch(`https://oauth2.googleapis.com/token`, {
      method: "POST",
      body: JSON.stringify({
        code: code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (res.ok) {
      const tokenRes: GoogleOAuthCodeExchangeResponse = await res.json()
      return tokenRes.id_token
    } else {
      throw Error('Something went wrong exchanging the Google oauth code for an id token, response status: ' + res.status + ', response body: ' + res.body)
    }
  }
}