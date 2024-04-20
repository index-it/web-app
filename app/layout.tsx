import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryClientContextProvider from "@/components/QueryClientContextProvider";

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
      <QueryClientContextProvider>
        {children}
      </QueryClientContextProvider>
      </body>
    </html>
  );
}
