"use client"

import {Button, buttonVariants} from "@/components/ui/button";
import Image from "next/image";
import {Icon} from "@/components/ui/icon";
import Link from "next/link";
import { useGoogleLogin } from '@react-oauth/google';
import { useIxApiClient } from "@/hooks/useIxApiClient";
import { useState } from "react";
import { IxApiError } from "@/lib/models/index/core/IxApiError";
import { useToast } from "@/components/ui/use-toast";
import { IxApiErrorResponse } from "@/lib/services/IxApiErrorResponse";
import { GoogleOAuthCodeExchangeApiResponse } from "@/app/api/auth/google/route";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const ixApiClient = useIxApiClient()
  const router = useRouter()
  const { toast } = useToast()
  const [googleLoading, setGoogleLoading] = useState(false)

  const loginWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async tokenResponse => {
      const code = tokenResponse.code

      const idTokenResponse = await fetch(`/api/auth/google?code=${code}`);

      if (idTokenResponse.ok) {
        const { id_token }: GoogleOAuthCodeExchangeApiResponse = await idTokenResponse.json()
        try {
          ixApiClient.loginWithGoogle(id_token)
          setGoogleLoading(false)
          router.push("/")
        } catch(e) {
          setGoogleLoading(false)
          if (e instanceof IxApiError) {
            if (e.ixApiErrorResponse === IxApiErrorResponse.LOGIN_EMAIL_NOT_VERIFIED) {
              toast({
                description: 'Your Google account email is not verified, please verify it before trying to login with Google',
                variant: "destructive"
              })
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
      } else {
        setGoogleLoading(false)
        toast({
          description: IxApiErrorResponse.UNKNOWN,
          variant: "destructive"
        })
      }
    },
  });

  return (
    <>
      {/* Logo and welcome text */}
      <Image
          src="/logo.png"
          width={500}
          height={500}
          alt="Index logo"
          className="size-20 rounded-2xl shadow-xl border border-border select-none"
          draggable={false}
        />

        <p className="text-2xl font-semibold text-center mt-4">Welcome to Index</p>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-2 mt-8">
          <Button
            className="gap-2 justify-start"
            onClick={ () => {
              setGoogleLoading(true)
              loginWithGoogle()
            }}
          >
            {googleLoading && <Spinner className="mr-2 size-4" /> }
            {!googleLoading && <Icon icon="logos:google-icon" className="size-4"/> }
            Continue with Google
          </Button>
          <Link href="/auth/email" className={buttonVariants() + " gap-2 justify-start"}>
            <Icon icon="material-symbols:mail-rounded" className="size-4" />
            Continue with email
          </Link>
        </div>

        {/* Terms and conditions */}
        <p className="text-xs text-center mt-6">By using Index you agree to our <a href="https://index-it.app/terms" target="_blank" className="text-link">Terms of Service</a> and <a href="https://index-it.app/terms" target="_blank" className="text-link">Privacy Policy.</a></p>
    </>
  );
}