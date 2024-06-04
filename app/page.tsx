"use client";

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";

export default function Home() {
  const ixApiClient = useIxApiClient()

  const query = useQuery({
    queryKey: [],
    queryFn: ixApiClient.getLoggedInUser
  })

  return (
    <main className="">
      {query.isLoading && <p>Loading...</p>}
      {query.isError && <p>Error: {query.error.message}</p>}
      {query.data && (
        <>
          {typeof query.data === "string" ? (
            <p>Error: {query.data}</p>
          ) : (
            <div>
              <p>Welcome, {query.data.email}!</p>
              {/* Render other user data here */}
            </div>
          )}
        </>
      )}
    </main>
  );
}