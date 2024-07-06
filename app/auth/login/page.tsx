"use client";

import {useRouter} from "next/navigation";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { redirectOnLoginSuccess } from "@/lib/utils";

const FormSchema = z.object({
  password: z.string()
})

export default function LoginPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const ixApiClient = useIxApiClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState("")

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: ""
    },
  })

  useEffect(() => {
    const email = sessionStorage.getItem(StorageConstants.AUTH_EMAIL)

    if (email === null) {
      router.push("/auth/email")
    } else {
      setEmail(email)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    const password = data.password
    try {
      await ixApiClient.loginWithEmailAndPassword(email, password)
      setLoading(false)
      redirectOnLoginSuccess(queryClient, router)
    } catch (e) {
      setLoading(false)

      if (e instanceof IxApiError) {
        if (e.ixApiErrorResponse == IxApiErrorResponse.LOGIN_EMAIL_NOT_VERIFIED) {
          sessionStorage.setItem(StorageConstants.AUTH_PASSWORD, password)
          router.push("/auth/verify-email")
        } else {
          toast({
            description: e.ixApiErrorResponse,
            variant: "destructive"
          })
        }
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

      <p className="text-2xl font-semibold text-center mt-4">Insert your password to login</p>

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
                      placeholder="Enter your password" {...field}
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
              Login
            </Button>
          </div>
          <AlertDialog>
            <AlertDialogTrigger>
              <p className="underline text-end opacity-40 text-sm">I forgot my password</p>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Forgot your password?</AlertDialogTitle>
                <AlertDialogDescription>
                  We can send you an email with instructions on how to reset it!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={ async () => {
                    try {
                      await ixApiClient.sendPasswordForgottenEmail(email)
                      toast({
                        description: `We have sent an email to ${email} with instructions on how to reset the password!`,
                        variant: 'default'
                      })
                    } catch(e) {
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
                  }}
                >
                  Send me the email
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </>
  );
}