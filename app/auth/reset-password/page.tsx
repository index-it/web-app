"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
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
import {Spinner} from "@/components/ui/spinner";
import {StorageConstants} from "@/lib/services/StorageConstants";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import { PasswordWithRepeatFormSchema } from "@/components/form/schemas/password-with-repeat-form-schema";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ixApiClient = useIxApiClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [repeatVisible, setRepeatVisible] = useState(false)
  const [token, setToken] = useState("")
  const [success, setSuccess] = useState(false)

  const form = useForm<z.infer<typeof PasswordWithRepeatFormSchema>>({
    resolver: zodResolver(PasswordWithRepeatFormSchema),
    defaultValues: {
      password: "",
      repeatPassword: ""
    },
  })

  useEffect(() => {
    const token = searchParams.get('token')

    if (token === null) {
      setTimeout(() => {
        toast({
          description: 'Request invalid or expired, please request a new password reset and try again!',
          variant: "destructive"
        })
      })
    } else {
      setToken(token)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(data: z.infer<typeof PasswordWithRepeatFormSchema>) {
    setLoading(true)

    const password = data.password
    try {
      await ixApiClient.resetPasswordUsingToken(token, password)
      setLoading(false)
      setSuccess(true)
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

  if (success) {
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

      <p className="text-2xl font-semibold text-center mt-4">Your password has been successfully reset!</p>
      <div className="flex flex-col mt-6 w-full sm:max-w-xs">
        <Button
          onClick={ () => router.push('/auth/welcome') }
          type="button"
        >Login</Button>
      </div>
      </>
    )
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

      <p className="text-2xl font-semibold text-center mt-4">Enter a new password for your account</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-8 w-full sm:max-w-sm">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      type={visible ? "text" : "password"}
                      placeholder="Enter your new password" {...field}
                    />
                    <Button
                      variant="outline"
                      onClick={ () => setVisible(!visible) }
                      type="button"
                    >
                      <Icon
                        icon={visible ? "material-symbols:visibility-off-outline-rounded" : "material-symbols:visibility-outline-rounded"}
                        className="size-5"
                      />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeatPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      type={repeatVisible ? "text" : "password"}
                      placeholder="Repeat it" {...field}
                    />
                    <Button
                      variant="outline"
                      onClick={ () => setRepeatVisible(!repeatVisible) }
                      type="button"
                    >
                      <Icon
                        icon={repeatVisible ? "material-symbols:visibility-off-outline-rounded" : "material-symbols:visibility-outline-rounded"}
                        className="size-5"
                      />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 max-w-full flex-wrap-reverse">
            <Link href="/auth/email" className={buttonVariants({variant: "secondary"})}>
              <Icon icon="material-symbols:arrow-back-rounded" className="size-5"/>
            </Link>
            <Button
              type="submit"
              className={buttonVariants() + " grow"}
              disabled={loading}
            >
              {loading && <Spinner className="mr-2 size-4" /> }
              Reset password
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}