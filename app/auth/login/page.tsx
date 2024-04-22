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
import {IxApiClient} from "@/lib/services/IxApiClient";
import {StorageConstants} from "@/lib/services/StorageConstants";
import {IxApiException} from "@/lib/services/IxApiException";

const FormSchema = z.object({
  password: z.string()
})

export default function LoginPage() {
  const router = useRouter()
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
    const user = await IxApiClient.loginWithEmailAndPassword(email, password)

    if (user === null) {
      router.push("/")
    } else if (user === IxApiException.LOGIN_EMAIL_NOT_VERIFIED) {
      sessionStorage.setItem(StorageConstants.AUTH_PASSWORD, password)
      router.push("/auth/verify-email")
    } else {
      toast({
        description: user,
        variant: "destructive"
      })
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
          {/* TODO: Forgot password button */}
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
        </form>
      </Form>
    </>
  );
}