import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";

import { auth } from "@/auth";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

import ConvexClientProvider from "@/providers/convex-client-provider";
import { ModalProvider } from "@/providers/modal-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Fragmenta",
  description: "A new way to manage your forms.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ConvexClientProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <ModalProvider />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
