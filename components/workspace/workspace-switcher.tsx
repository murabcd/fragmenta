"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useWorkspace } from "@/hooks/use-workspace";
import type { Id } from "@/convex/_generated/dataModel";
import { UserWorkspace } from "@/components/workspace/user-workspace";

interface Workspace {
	name: string;
	logo: React.ElementType;
	plan: string;
	id?: Id<"workspaces">;
	imageUrl?: string;
}

export function WorkspaceSwitcher({ workspaces }: { workspaces: Workspace[] }) {
	const { isMobile } = useSidebar();
	const { workspace, setCurrentWorkspace } = useWorkspace();
	const [isUserWorkspaceOpen, setIsUserWorkspaceOpen] = React.useState(false);

	// Set active workspace based on current workspace or first workspace
	const [activeWorkspace, setActiveWorkspace] =
		React.useState<Workspace | null>(null);

	React.useEffect(() => {
		if (workspaces.length > 0) {
			const currentWorkspace =
				workspaces.find((ws) => ws.id === workspace?._id) || workspaces[0];
			setActiveWorkspace(currentWorkspace);
		}
	}, [workspaces, workspace?._id]);

	const handleWorkspaceSelect = (ws: Workspace) => {
		setActiveWorkspace(ws);
		if (ws.id && setCurrentWorkspace) {
			setCurrentWorkspace({
				_id: ws.id,
				name: ws.name,
				slug: ws.name.toLowerCase().replace(/\s+/g, "-"),
				imageUrl: ws.imageUrl,
				role: ws.plan === "Pro" ? "owner" : "member",
			});
		}
	};

	if (!workspaces.length || !activeWorkspace) {
		return null;
	}

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								{activeWorkspace.imageUrl ? (
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={activeWorkspace.imageUrl}
											alt={activeWorkspace.name}
										/>
										<AvatarFallback className="rounded-lg">
											<activeWorkspace.logo className="size-4" />
										</AvatarFallback>
									</Avatar>
								) : (
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg border">
										<activeWorkspace.logo className="size-4" />
									</div>
								)}
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{activeWorkspace.name}
									</span>
									<span className="truncate text-xs">
										{activeWorkspace.plan}
									</span>
								</div>
								<ChevronsUpDown className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							align="start"
							side={isMobile ? "bottom" : "right"}
							sideOffset={4}
						>
							<DropdownMenuLabel className="text-muted-foreground text-xs">
								Workspaces
							</DropdownMenuLabel>
							{workspaces.map((ws, index) => (
								<DropdownMenuItem
									key={ws.id || ws.name}
									onClick={() => handleWorkspaceSelect(ws)}
									className="gap-2 p-2"
								>
									{ws.imageUrl ? (
										<Avatar className="h-6 w-6 rounded-lg">
											<AvatarImage src={ws.imageUrl} alt={ws.name} />
											<AvatarFallback className="rounded-lg">
												<ws.logo className="size-3.5 shrink-0" />
											</AvatarFallback>
										</Avatar>
									) : (
										<div className="flex size-6 items-center justify-center rounded-lg border">
											<ws.logo className="size-3.5 shrink-0" />
										</div>
									)}
									{ws.name}
									<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
								</DropdownMenuItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="gap-2 p-2"
								onClick={() => setIsUserWorkspaceOpen(true)}
							>
								<div className="flex size-6 items-center justify-center rounded-lg border bg-transparent">
									<Plus className="size-4" />
								</div>
								<div className="text-muted-foreground font-medium">
									Add workspace
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
			<UserWorkspace
				isOpen={isUserWorkspaceOpen}
				onOpenChange={setIsUserWorkspaceOpen}
			/>
		</>
	);
}
