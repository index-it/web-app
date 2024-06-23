"use client";

import { useQuery } from "@tanstack/react-query";
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

export default function Home() {
  const ixApiClient = useIxApiClient()
  const { toast } = useToast()
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
  const [createListLoading, setCreateListLoading] = useState(false)
  const form = useForm<z.infer<typeof ListCreateFormSchema>>({
    resolver: zodResolver(ListCreateFormSchema),
    defaultValues: {
      name: "",
      icon: "🏀",
      color: "#0000ff",
      public: false
    },
  })

  function onEmojiSelect(emoji: any) {
    setOpenEmojiPicker(false);
    form.setValue("icon", emoji.native);
  }

  function onColorSelect(color: any) {
    console.log(color)
    form.setValue("color", color.target.value);
  }

  async function onSubmit(data: z.infer<typeof ListCreateFormSchema>) {
    setCreateListLoading(true)

    // const password = data.password
    // try {
    //   await ixApiClient.loginWithEmailAndPassword(email, password)
    //   setLoading(false)
    //   redirectOnLoginSuccess(queryClient)
    // } catch (e) {
    //   setLoading(false)

    //   if (e instanceof IxApiError) {
    //     if (e.ixApiErrorResponse == IxApiErrorResponse.LOGIN_EMAIL_NOT_VERIFIED) {
    //       sessionStorage.setItem(StorageConstants.AUTH_PASSWORD, password)
    //       router.push("/auth/verify-email")
    //     } else {
    //       toast({
    //         description: e.ixApiErrorResponse,
    //         variant: "destructive"
    //       })
    //     }
    //   } else {
    //     toast({
    //       description: IxApiErrorResponse.UNKNOWN,
    //       variant: "destructive"
    //     })
    //   }
    // }
  }

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
      <>
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <span className="text-2xl font-semibold">Welcome back!</span>

          <div className="flex gap-4">
            <Link href="/tasks" className={buttonVariants({ size: "sm" })}>
              Your tasks
            </Link>

            <Dialog modal={false}>
              <DialogTrigger asChild>
                <Button size="sm">
                  Create list
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create a new list</DialogTitle>
                  <DialogDescription>
                    Choose a name, icon and color for your new list!
                  </DialogDescription>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 pt-4 w-full">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-4 space-y-0">
                            <FormLabel className="min-w-12">Name</FormLabel>
                            <div className="flex flex-col gap-1">
                              <FormControl className="flex items-center">
                                <Input
                                  placeholder="Enter a name" {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>

                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-4 space-y-0">
                            <FormLabel className="min-w-12">Icon</FormLabel>
                            <div className="flex flex-col gap-1">
                              <FormControl className="flex items-center">
                                <div className="relative">
                                  <Dialog modal={false} open={openEmojiPicker} onOpenChange={setOpenEmojiPicker}>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" type="button" className="w-min text-lg">{form.getValues().icon}</Button>
                                    </DialogTrigger>
                                    <DialogContent hideCloseButton={true} className="w-min bg-transparent border-none shadow-none">
                                      <Picker data={emojiData} onEmojiSelect={onEmojiSelect} />
                                    </DialogContent>
                                  </Dialog>
                                </div>

                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-4 space-y-0">
                            <FormLabel className="min-w-12">Color</FormLabel>
                            <div className="flex flex-col gap-1">
                              <FormControl className="flex items-center">
                                <input
                                  type="color"
                                  className={buttonVariants({ variant: "outline" })}
                                  value={form.getValues().color}
                                  onChange={onColorSelect}
                                />
                                {/* <Button variant="outline" type="button" className="w-min">🏀</Button> */}
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="public"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-4 space-y-0">
                            <FormLabel className="min-w-12">Public</FormLabel>
                            <div className="flex flex-col gap-1">
                              <FormControl>
                                <Switch />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-center">
                        <Button
                          type="submit"
                          className="w-min mt-4"
                          disabled={createListLoading}
                        >
                          {createListLoading && <Spinner className="mr-2 size-4" />}
                          Create list
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="p-4 flex gap-4">
            {data.map((list) => (
              <Link href={`/lists/${list.id}`} key={list.id}>
                <IxListCard name={list.name} color={list.color} icon={list.icon} />
              </Link>
            ))}
          </div>
        </div>
      </>
    )
  }
}