"use client";

import { Home, Workflow, FolderOpen } from "lucide-react";

import { NavMain } from "@/components/navigation/nav-main";
import { NavUser } from "@/components/navigation/nav-user";
import { WorkspaceSwitcher } from "@/components/workspace/workspace-switcher";
import { SearchToggleCommand } from "@/components/navigation/search-command";
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
