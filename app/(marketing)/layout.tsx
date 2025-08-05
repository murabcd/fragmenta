"use client";

import { GridPattern } from "@/components/grid-pattern";
import { HeaderSection } from "./_components/header-section";
import { Footer } from "./_components/footer";
import { ThemeProvider } from "next-themes";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			forcedTheme="dark"
			enableSystem={false}
			disableTransitionOnChange
		>
			<div className="flex flex-col min-h-screen relative">
				<GridPattern />
				<HeaderSection />
				<main className="flex-grow relative z-10">{children}</main>
				<Footer />
			</div>
		</ThemeProvider>
	);
}
