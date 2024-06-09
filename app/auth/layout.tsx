import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

export default function AuthLayout({
 children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (clientId === undefined) {
    throw Error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable')
  }

  return (
    <>
    <GoogleOAuthProvider clientId={clientId}>
      <main className="flex flex-col items-center justify-center w-full h-full px-4">{children}</main>
    </GoogleOAuthProvider>
    </>
  )
}