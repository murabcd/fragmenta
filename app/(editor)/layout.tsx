import { ThemeProvider } from "@/components/providers/theme-provider";

interface EditorLayoutProps {
	children: React.ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
	);
}
