import { Sidebar } from "@/components/ui/layout/sidebar";
import React from "react";
import UnderConstructionPage from "../under-construction/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (process.env.NODE_ENV === "production") {
    return <>
      <UnderConstructionPage />
    </>
  } else {
    return <>
      <main className="flex h-full">
        <Sidebar />
        {children}
      </main >
    </>
  }
}
