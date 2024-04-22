"use client";

import Image from "next/image";
import {Button, buttonVariants} from "@/components/ui/button";
import {Icon} from "@/components/ui/icon";
import Link from "next/link";
import {Input} from "@/components/ui/input";
// import {getWelcomeAction } from "@/lib/services/IndexApiClient";
import {z} from "zod";
import {Form} from "@/components/ui/form"
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {IxApiClient} from "@/lib/services/IxApiClient";
import {useToast} from "@/components/ui/use-toast";
import {IxApiException} from "@/lib/services/IxApiException";
import {IxWelcomeAction} from "@/lib/models/index/IxWelcomeAction";
import {useRouter} from "next/navigation";
import { useState } from "react";
import {Spinner} from "@/components/ui/spinner";

const FormSchema = z.object({
  email: z.string().email('You must input a valid email address')
})

export default function EmailAuthPage() {
  const router = useRouter()
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
    const welcomeAction = await IxApiClient.getWelcomeAction(data.email)

    if (welcomeAction === IxApiException.UNKNOWN) {
      toast({
        description: welcomeAction,
        variant: "destructive"
      })
    } else if (welcomeAction === IxWelcomeAction.LOGIN) {
      router.push("/auth/login?email=" + data.email)
    } else if (welcomeAction === IxWelcomeAction.REGISTER) {
      router.push("/auth/register?email=" + data.email)
    }

    setLoading(false)
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-8">
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
          <div className="flex gap-2">
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