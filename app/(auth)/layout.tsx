import { ThemeProvider } from "@/components/providers/theme-provider";

interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
		>
			<div className="min-h-screen">{children}</div>
		</ThemeProvider>
	);
}
