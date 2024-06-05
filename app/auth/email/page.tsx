"use client";

import Image from "next/image";
import {Button, buttonVariants} from "@/components/ui/button";
import {Icon} from "@/components/ui/icon";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {Form} from "@/components/ui/form"
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useToast} from "@/components/ui/use-toast";
import {IxWelcomeAction} from "@/lib/models/index/IxWelcomeAction";
import {useRouter} from "next/navigation";
import { useState } from "react";
import {Spinner} from "@/components/ui/spinner";
import {StorageConstants} from "@/lib/services/StorageConstants";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import { IxApiErrorResponse } from "@/lib/services/IxApiErrorResponse";

const FormSchema = z.object({
  email: z.string().email('You must input a valid email address')
})

export default function EmailAuthPage() {
  const router = useRouter()
  const ixApiClient = useIxApiClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const email = data.email
    try {
      const welcomeAction = await ixApiClient.getWelcomeAction(email)

      sessionStorage.setItem(StorageConstants.AUTH_EMAIL, email)
      setLoading(false)

      if (welcomeAction === IxWelcomeAction.LOGIN) {
        router.push("/auth/login")
      } else if (welcomeAction === IxWelcomeAction.REGISTER) {
        router.push("/auth/register")
      }
    } catch (e) {
      setLoading(false)

      if (e instanceof IxApiError) {
        toast({
          description: e.ixApiErrorResponse,
          variant: "destructive"
        })
      } else {
        toast({
          description: IxApiErrorResponse.UNKNOWN,
          variant: "destructive"
        })
      }
    }
  }

  return (
    <>
      <Image
        src="/logo.png"
        width={500}
        height={500}
        alt="Index logo"
        className="size-20 rounded-2xl shadow-xl border border-border select-none"
        draggable={false}
      />

      <p className="text-2xl font-semibold text-center mt-4">Insert your email to get started</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-8 w-full sm:max-w-sm">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Insert your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 flex-wrap-reverse">
            <Link href="/auth/welcome" prefetch={true} className={buttonVariants({variant: "secondary"})}>
              <Icon icon="material-symbols:arrow-back-rounded" className="size-5"/>
            </Link>
            <Button
              type="submit"
              className={buttonVariants() + " grow"}
              disabled={loading}
            >
              {loading && <Spinner className="mr-2 size-4" /> }
              Continue with Email
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}