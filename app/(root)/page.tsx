"use client";

import { useQuery } from "@tanstack/react-query";
import { useIxApiClient } from "@/hooks/useIxApiClient";
import { IxApiError } from "@/lib/models/index/core/IxApiError";
import { IxApiErrorResponse } from "@/lib/services/IxApiErrorResponse";
import { checkForAuthenticationError, redirectToLogin } from "@/lib/utils";
import { IxListCard } from "@/components/ui/index/ix-list-card";

export default function Home() {
  const ixApiClient = useIxApiClient()

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['lists'],
    queryFn: ixApiClient.getLists
  })

  if (checkForAuthenticationError(error)) {
    redirectToLogin()
  }

  if (isPending) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error: {error.message}</p>
  }

  if (data !== undefined) {
    return <>
      <div className="p-4 flex items-end w-full justify-end">
        {data.map((list) => (
          <IxListCard key={list.id} name={list.name} color={list.color} icon={list.icon} />
        ))}
      </div>
    </>
  }
}