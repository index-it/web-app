import { Sidebar } from "@/components/ui/layout/sidebar";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex h-full">
      <Sidebar />
      {children}
    </main>
  );
}
