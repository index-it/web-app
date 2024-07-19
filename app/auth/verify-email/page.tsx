"use client";

import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Icon} from "@/components/ui/icon";
import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {StorageConstants} from "@/lib/services/StorageConstants";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";
import {redirect_on_login_success} from "@/lib/utils";
import {clearInterval} from "timers";
import {useQueryClient} from "@tanstack/react-query";

export default function EmailAuthPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const ixApiClient = useIxApiClient()
  const { toast } = useToast()
  const [sendLoading, setSendLoading] = useState(false)
  const [checkLoading, setCheckLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function checkForVerification() {
    try {
      setCheckLoading(true)
      const verified = await ixApiClient.is_email_verified(email, password)

      setCheckLoading(false)
      if (verified) {
        redirect_on_login_success(queryClient, router)
      } else {
        toast({
          description: 'Your email is not verified yet, check your inbox',
          variant: "default"
        })
      }
    } catch(e) {
      setCheckLoading(false)
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

  useEffect(() => {
    const email = sessionStorage.getItem(StorageConstants.AUTH_EMAIL)
    const password = sessionStorage.getItem(StorageConstants.AUTH_PASSWORD)

    if (email === null ) {
      router.push("/auth/email")
    } else {
      setEmail(email)
    }

    if (password === null) {
      router.back()
    } else {
      setPassword(password)
    }

    const interval = setInterval(checkForVerification, 10000)

    return () => { clearInterval(interval) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <p className="text-2xl font-semibold text-center mt-4">Please check your inbox to verify your email</p>

      <div className="flex flex-col gap-2 mt-8 w-full sm:max-w-sm">
        <div className="flex gap-2">
          <Button
            onClick={() => router.back()}
            variant="secondary"
          >
            <Icon icon="material-symbols:arrow-back-rounded" className="size-5"/>
          </Button>
          <Button
            variant="secondary"
            className="grow"
            disabled={sendLoading}
            onClick={async () => {
              try {
                setSendLoading(true)
                // TODO: Debug the fact that this show the error toast
                const verified = await ixApiClient.send_verification_email(email, password)
                setSendLoading(false)

                if (verified) {
                  redirect_on_login_success(queryClient, router)
                } else {
                  toast({
                    description: 'We sent you another verification email!',
                    variant: "default"
                  })
                }
              } catch(e) {
                setSendLoading(false)
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
            {sendLoading && <Spinner className="mr-2 size-4" /> }
            Send another email
          </Button>
        </div>
        <Button
            className="grow"
            disabled={checkLoading}
            onClick={checkForVerification}
          >
            {checkLoading && <Spinner className="mr-2 size-4" /> }
            I verified it!
          </Button>
      </div>
    </>
  );
}