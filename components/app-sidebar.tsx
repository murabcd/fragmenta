"use client";

import { Home, Workflow, History, FolderOpen } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { SearchToggleCommand } from "@/components/search-command";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useWorkspace } from "@/hooks/use-workspace";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { userMemberships } = useWorkspace();
	const userData = useQuery(api.users.getCurrentUser);

	const workspaces =
		userMemberships.data?.map((ws: any) => ({
			name: ws.name,
			logo: FolderOpen,
			plan: ws.role === "owner" ? "Pro" : "Free",
			id: ws._id,
			imageUrl: ws.imageUrl,
		})) || [];

	const navMain = [
		{
			title: "Home",
			url: "/home",
			icon: Home,
		},
		{
			title: "Forms",
			url: "/forms",
			icon: Workflow,
		},
		{
			title: "Recent",
			url: "/recent",
			icon: History,
		},
	];

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<WorkspaceSwitcher workspaces={workspaces} />
			</SidebarHeader>
			<SidebarContent>
				<SearchToggleCommand />
				<NavMain items={navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: userData?.name || "User",
						email: userData?.email || "user@example.com",
						avatar: userData?.image || "",
					}}
				/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
