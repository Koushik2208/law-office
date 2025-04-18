import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

import { SessionProvider } from "next-auth/react";

const poppins = localFont({
  src: './fonts/Poppins-Regular.ttf',
  variable: "--font-poppins",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider>
        <body className={`${poppins.variable} ${poppins.className} antialiased bg-gray-50/50`}>
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  )
}
