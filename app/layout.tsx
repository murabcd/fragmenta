import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import { ConvexClientProvider } from "@/app/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

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
	openGraph: {
		title: "Fragmenta",
		description: "A new way to manage your forms.",
		url: "https://fragmenta.vercel.app",
		siteName: "Fragmenta",
		images: [
			{
				url: "/api/og",
				width: 1200,
				height: 630,
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Fragmenta",
		description: "A new way to manage your forms.",
		images: ["/api/og"],
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<ConvexAuthNextjsServerProvider>
					<ConvexClientProvider>
						{children}
						<Toaster />
					</ConvexClientProvider>
				</ConvexAuthNextjsServerProvider>
			</body>
		</html>
	);
}
