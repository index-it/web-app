import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex flex-col items-center justify-center w-full h-full px-4">{children}</main>
    </>
  )
}