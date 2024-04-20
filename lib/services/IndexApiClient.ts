/**
 * Client to interact with the Index API
 */
export class IndexApiClient {
  private static BASE_URL = "https://api.index-it.app"

  /**
   * Fetches the welcome action for the given `email`
   *
   * @param email
   *
   * @return the `WelcomeAction` for the given email, or null if the request fails
   */
  public static async getWelcomeAction(email: String): Promise<WelcomeAction | null> {
    const res = await fetch(`${this.BASE_URL}/welcome-action?email=${email}`)

    if (res.ok) {
      const data: WelcomeActionResponse = await res.json()
      return data.action
    } else {
      return null;
    }
  }
}