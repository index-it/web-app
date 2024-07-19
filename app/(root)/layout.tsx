import {Sidebar} from "@/components/ui/layout/sidebar";
import React from "react";
import UnderConstructionDialog from "../under-construction/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <main className="flex h-full">
      {process.env.NODE_ENV === "production" && <UnderConstructionDialog />}
      <Sidebar />
      {children}
    </main >
  </>
}
