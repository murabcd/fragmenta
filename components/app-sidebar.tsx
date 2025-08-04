"use client";

import * as React from "react";
import { Home, Settings2, Workflow, History, FolderOpen } from "lucide-react";

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
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = useSession();
	const { organization, userMemberships } = useOrganization();
	const user = useQuery(api.users.get, {
		id: session?.user?.id as Id<"users">,
	});

	const userData = user || session?.user;

	// Convert organizations to the format expected by OrganizationSwitcher
	const organizations =
		userMemberships.data?.map((org) => ({
			name: org.name || "Unnamed Organization",
			logo: FolderOpen,
			plan: org.role === "owner" ? "Pro" : "Free",
			id: org._id,
			imageUrl: org.imageUrl,
		})) || [];

	// Simplified navigation items - no collapsible sections
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
