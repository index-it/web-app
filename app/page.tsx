"use client";

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {IxApiClient} from "@/lib/services/IxApiClient";
import {IxApiException} from "@/lib/services/IxApiException";
import {IxUser} from "@/lib/models/index/IxUser";

export default function Home() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [],
    queryFn: IxApiClient.getLoggedInUser
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