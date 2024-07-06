"use client";

import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { useIxApiClient } from "@/hooks/useIxApiClient";
import { IxApiError } from "@/lib/models/index/core/IxApiError";
import { IxApiErrorResponse } from "@/lib/services/IxApiErrorResponse";
import { StorageConstants } from "@/lib/services/StorageConstants";
import { checkForAuthenticationError, cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function CallbackListsAcceptInvitationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const ixApiClient = useIxApiClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (token == null || email == null) {
      setTimeout(() => {
        toast({
          description: 'Request invalid or expired, please request a new invitation and try again!',
          variant: "destructive"
        })
      })
    } else {
      const acceptInvitation = async () => {
        setLoading(true)

        try {
          const list = await ixApiClient.acceptListInvitation(token);
          setLoading(false)
          router.push(`/lists/${list}`)
        } catch (e) {
          setLoading(false)

          if (e instanceof IxApiError) {
            if (e.ixApiErrorResponse == IxApiErrorResponse.LIST_INVITATION_USER_NOT_FOUND) {
              // prefill email
              sessionStorage.setItem(StorageConstants.AUTH_EMAIL, email)

              // save callback url
              const pathWithQuery = location.pathname + location.search;
              sessionStorage.setItem(StorageConstants.AUTH_REDIRECT_URI, pathWithQuery)

              // redirect to register
              router.push("/auth/register")
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

      acceptInvitation();
    }
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

      <div className={cn("flex items-center justify-center mt-8 gap-4", loading ? 'animate-pulse' : '')}>

        {loading && <>
          <Spinner className="size-6" />
          <p className="text-2xl font-semibold text-center">Accepting the list invitation</p>
        </>}

        {!loading && <div className="flex flex-col items-center gap-2">
          <p className="text-2xl font-semibold text-center">Something went wrong while accepting the list invitation</p>
          <p className="text-lg text-center">Please request a new invitation or try refreshing the page</p>
        </div>}
      </div>

    </>
  )
}