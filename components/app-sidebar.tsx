"use client";

import { Home, Workflow, History, FolderOpen } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { OrganizationSwitcher } from "@/components/org-switcher";
import { SearchToggleCommand } from "@/components/search-command";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useOrganization } from "@/hooks/use-organization";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { userMemberships } = useOrganization();
	const userData = useQuery(api.users.getCurrentUser);

	const organizations =
		userMemberships.data?.map((org: any) => ({
			name: org.name,
			logo: FolderOpen,
			plan: org.role === "owner" ? "Pro" : "Free",
			id: org._id,
			imageUrl: org.imageUrl,
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
				<OrganizationSwitcher organizations={organizations} />
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
