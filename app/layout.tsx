import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientContextProvider from "@/components/QueryClientContextProvider";
import {Toaster} from "@/components/ui/toaster";
import IxApiClientContextProvider from "@/components/IxApiClientContextProvider";
import React from "react";

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
          </QueryClientContextProvider>
        </IxApiClientContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
