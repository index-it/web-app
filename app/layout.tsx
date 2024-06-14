import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientContextProvider from "@/components/QueryClientContextProvider";
import { Toaster } from "@/components/ui/toaster";
import IxApiClientContextProvider from "@/components/IxApiClientContextProvider";
import React from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Index web",
  description: "The app for any kind of list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <IxApiClientContextProvider>
          <QueryClientContextProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientContextProvider>
        </IxApiClientContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
