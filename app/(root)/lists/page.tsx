"use client"

import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useToast} from "@/components/ui/use-toast";
import {useState} from "react";
import {useCreateListMutation} from "@/hooks/mutations/index/list/useCreateListMutation";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import {ListFormDialogContent} from "@/components/ui/index/form/list-form-dialog";
import {IxListCard} from "@/components/ui/index/ix-list-card";
import {useLists} from "@/hooks/queries/useLists";

export default function ListsPage() {
  const ixApiClient = useIxApiClient()
  const { toast } = useToast()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const createListMutation = useCreateListMutation({
    onSuccess: (_data, _variables, _context) => {
      setCreateDialogOpen(false)
    },
    onError: (error, _variables, _context) => {
      if (error instanceof IxApiError) {
        toast({
          description: error.ixApiErrorResponse,
          variant: "destructive"
        })
      } else {
        toast({
          description: IxApiErrorResponse.UNKNOWN,
          variant: "destructive"
        })
      }
    }
  })

  const { isPending, isError, data, error } = useLists()

  if (isPending) {
    // TODO
    return <p>Loading...</p>
  }

  if (isError) {
    // TODO
    return <p>Error: {error.message}</p>
  }

  if (data !== undefined) {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <span className="text-2xl font-semibold text-center">Welcome back!</span>

          <div className="flex gap-4 flex-wrap items-center justify-center">
            <Link href="/tasks" className={buttonVariants({ size: "sm" })}>
              Your tasks
            </Link>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  Create list
                </Button>
              </DialogTrigger>
              <ListFormDialogContent
                loading={createListMutation.isPending}
                edit={false}
                onFormSubmit={createListMutation.mutate}
              />
            </Dialog>
          </div>
          <div className="p-4 flex items-center justify-center">
            <div className="gap-4 grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.map((list) => (
                <Link href={`/lists/${list.id}`} key={list.id}>
                  <IxListCard name={list.name} color={list.color} icon={list.icon} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }
}