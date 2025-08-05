"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SearchCommand } from "@/components/search-command";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { useSelectedLayoutSegment } from "next/navigation";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
	const segment = useSelectedLayoutSegment();

	const getBreadcrumbTitle = () => {
		switch (segment) {
			case "home":
				return "Home";
			case "settings":
				return "Settings";
			case "forms":
				return "Forms";
			case "recent":
				return "Recent";
			default:
				return "Home";
		}
	};

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
		>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 data-[orientation=vertical]:h-4"
							/>
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem>
										<BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
						<SearchCommand />
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
			<Toaster />
		</ThemeProvider>
	);
};

export default HomeLayout;
