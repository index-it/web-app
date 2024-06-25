"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIxApiClient } from "@/hooks/useIxApiClient";
import { checkForAuthenticationError, redirectToLogin } from "@/lib/utils";
import { IxListCard } from "@/components/ui/index/ix-list-card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ListCreateFormSchema } from "@/components/form/schemas/list-create-form-schema";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import emojiData, { Emoji } from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { DialogOverlay } from "@radix-ui/react-dialog";
import { IxApiError } from "@/lib/models/index/core/IxApiError";
import { IxApiErrorResponse } from "@/lib/services/IxApiErrorResponse";
import { IxList } from "@/lib/models/index/IxList";
import { CreateListDialog } from "@/components/ui/index/create-list-dialog";

export default function Home() {
  const ixApiClient = useIxApiClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const createListMutation = useMutation({
    mutationFn: (params: { name: string; icon: string; color: string; public: boolean }) => {
      return ixApiClient.createList(params.name, params.icon, params.color, params.public);;
    },
    onError: (error, _variables, _context) => {
      if (error instanceof IxApiError) {
        if (error.ixApiErrorResponse == IxApiErrorResponse.NOT_AUTHENTICATED) {
          redirectToLogin()
        } else {
          toast({
            description: error.ixApiErrorResponse,
            variant: "destructive"
          })
        }
      } else {
        toast({
          description: IxApiErrorResponse.UNKNOWN,
          variant: "destructive"
        })
      }
    },
    onSuccess: (data, _variables, _context) => {
      setCreateDialogOpen(false)
      queryClient.setQueryData(['lists'], (old: IxList[]) => [...old, data]);
    },
  })

  async function onCreateListFormSubmit(data: z.infer<typeof ListCreateFormSchema>) {
    createListMutation.mutate({ name: data.name, icon: data.icon, color: data.color, public: data.public });
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['lists'],
    queryFn: ixApiClient.getLists
  })

  if (checkForAuthenticationError(error)) {
    redirectToLogin()
  }

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
          <span className="text-2xl font-semibold">Welcome back!</span>

          <div className="flex gap-4">
            <Link href="/tasks" className={buttonVariants({ size: "sm" })}>
              Your tasks
            </Link>

            <CreateListDialog
              open={createDialogOpen}
              setOpen={setCreateDialogOpen}
              loading={createListMutation.isPending}
              onCreateListFormSubmit={onCreateListFormSubmit}
            />
          </div>
          <div className="p-4 flex items-center justify-center">
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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