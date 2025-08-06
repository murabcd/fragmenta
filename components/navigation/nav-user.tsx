"use client";

import {
	ChevronsUpDown,
	CreditCard,
	Moon,
	Sun,
	LogOut,
	Settings2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useAuthActions } from "@convex-dev/auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function NavUser({
	user,
}: {
	user:
		| {
				name: string;
				email: string;
				avatar: string;
		  }
		| undefined
		| null;
}) {
	const { isMobile } = useSidebar();
	const { theme, setTheme } = useTheme();
	const { signOut } = useAuthActions();
	const router = useRouter();
	const handleSignOut = () => {
		void signOut();
		router.push("/");
	};

	if (!user) {
		return <NavUser.Skeleton />;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className="rounded-lg">
									{user.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuItem>
							<CreditCard className="mr-2 h-4 w-4" />
							Upgrade
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer"
							onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
						>
							{theme === "light" ? (
								<Moon className="h-4 w-4 mr-2" />
							) : (
								<Sun className="h-4 w-4 mr-2" />
							)}
							{`${theme === "light" ? "Dark" : "Light"} mode`}
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/settings/profile">
								<Settings2 className="mr-2 h-4 w-4" />
								Settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleSignOut}
							className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
						>
							<LogOut className="mr-2 h-4 w-4 text-red-600" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

NavUser.Skeleton = function NavUserSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" disabled>
					<Skeleton className="h-8 w-8 rounded-lg" /> {/* User avatar */}
					<div className="grid flex-1 text-left text-sm leading-tight">
						<Skeleton className="h-4 w-20 mb-1" /> {/* User name */}
						<Skeleton className="h-3 w-32" /> {/* User email */}
					</div>
					<Skeleton className="h-4 w-4 ml-auto" /> {/* Dropdown arrow */}
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
