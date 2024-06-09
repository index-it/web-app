"use client";

import {useQuery} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {checkForAuthenticationError, redirectToLogin} from "@/lib/utils";
import { IxListCard } from "@/components/ui/index/ix-list-card";

export default function Home() {
  const ixApiClient = useIxApiClient()

  const lists = useQuery({
    queryKey: ['lists'],
    queryFn: ixApiClient.getLists
  })

  if (checkForAuthenticationError(lists.error)) {
    redirectToLogin()
  }

  if (lists.isLoading) {
    return <p>Loading...</p>
  }

  if (lists.error) {
    return <p>Error: {lists.error.message}</p>
  }

  if (lists.data !== undefined) {
    return <>
      <div>
        {lists.data.map((list) => (
          <IxListCard key={list.id} name={list.name} color={list.color} icon={list.icon} />
        ))}
      </div>
    </>
  }
}