import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import "./globals.css";
import ReactQueryProvider from "@/components/provider/ReactQueryProvider";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ReactQueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
        <body className={` ${roboto.variable} antialiased`}>{children}</body>
      </ReactQueryProvider>
    </html>
  );
}
