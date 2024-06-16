"use client";

import { useQuery } from "@tanstack/react-query";
import { useIxApiClient } from "@/hooks/useIxApiClient";
import { IxApiError } from "@/lib/models/index/core/IxApiError";
import { IxApiErrorResponse } from "@/lib/services/IxApiErrorResponse";
import { checkForAuthenticationError, redirectToLogin } from "@/lib/utils";
import { IxListCard } from "@/components/ui/index/ix-list-card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

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
    return (
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <span className="text-2xl font-semibold">Welcome back!</span>

        <div className="flex gap-4">
          <Link href="/tasks" className={buttonVariants({ size: "sm" })}>
            Your tasks
          </Link>

          <Button size="sm">
            Create list
          </Button>
        </div>
        <div className="p-4 flex gap-4">
          {data.map((list) => (
            <Link href={`/lists/${list.id}`} key={list.id}>
              <IxListCard name={list.name} color={list.color} icon={list.icon} />
            </Link>
          ))}
        </div>
      </div>
    )
  }
}