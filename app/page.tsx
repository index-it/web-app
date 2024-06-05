"use client";

import {useQuery} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {redirectToLogin} from "@/lib/utils";

export default function Home() {
  const ixApiClient = useIxApiClient()

  const user = useQuery({
    queryKey: [],
    queryFn: ixApiClient.getLoggedInUser
  })

  if (user.error instanceof IxApiError && user.error.ixApiErrorResponse == IxApiErrorResponse.NOT_AUTHENTICATED) {
    redirectToLogin()
  }

  return (
    <main className="">
      {user.isLoading && <p>Loading...</p>}
      {user.isError && <p>Error: {user.error.message}</p>}
      {user.data && (
        <>
          <div>
            <p>Welcome, {user.data.email}!</p>
            {/* Render other user data here */}
          </div>
        </>
      )}
    </main>
  );
}