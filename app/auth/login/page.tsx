"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {useToast} from "@/components/ui/use-toast";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {Icon} from "@/components/ui/icon";

const FormSchema = z.object({
  password: z.string()
})

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  useEffect(() => {
    if (email === null) {
      router.push("/auth/email")
    }
  }, [email]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: ""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    /*
     TODO:
      - store email in sessionStorage too
      - login with email and password
      - if success redirect to home
      - if email not verified navigate to email verification page and store password in sessionStorage
      - if error toast
     */
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Link href="/auth/email" className={buttonVariants({variant: "secondary"})}>
              <Icon icon="material-symbols:arrow-back-rounded" className="size-5"/>
            </Link>
            <Button type="submit" className={buttonVariants() + " grow"}>Login</Button>
          </div>
        </form>
      </Form>
    </>
  );
}