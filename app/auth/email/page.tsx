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
import {IndexApiClient} from "@/lib/services/IndexApiClient";

const FormSchema = z.object({
  email: z.string().email('You must input a valid email address')
})

export default function EmailAuthPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const welcomeAction = await IndexApiClient.getWelcomeAction(data.email)

    if (welcomeAction === null) {

    } else if (welcomeAction === WelcomeAction.LOGIN) {

    } else if (welcomeAction === WelcomeAction.REGISTER) {

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
            <Link href="/auth/welcome" className={buttonVariants({variant: "secondary"})}>
              <Icon icon="material-symbols:arrow-back-rounded" className="size-5"/>
            </Link>
            <Button type="submit" className={buttonVariants() + " grow"}>Continue with email</Button>

          </div>
        </form>
      </Form>
    </>
  );
}