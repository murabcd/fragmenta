"use client";

import { useWorkspace } from "@/hooks/use-workspace";

import { SidebarSettings } from "@/components/settings/sidebar-settings";
import { Skeleton } from "@/components/ui/skeleton";

const sidebar = [
	{
		title: "Profile",
		href: "/settings/profile",
	},
	{
		title: "Workspace",
		href: "/settings/workspace",
	},
	{
		title: "Members",
		href: "/settings/members",
	},
	{
		title: "Integrations",
		href: "/settings/integrations",
	},
	{
		title: "Billing",
		href: "/settings/billing",
	},
];

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
	const { isLoading } = useWorkspace();

	return (
		<section className="space-y-6 p-6 relative min-h-screen">
			<div className="w-full">
				<SidebarSettings items={sidebar} />
			</div>
			{isLoading ? (
				<SettingsLayout.Skeleton />
			) : (
				<div className="flex-1 max-w-3xl">{children}</div>
			)}
		</section>
	);
}

SettingsLayout.Skeleton = function SettingsLayoutSkeleton() {
	return (
		<div className="flex-1 max-w-3xl space-y-6">
			{/* Form card skeleton */}
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				{/* Card header skeleton */}
				<div className="flex flex-col space-y-1.5 p-6">
					<Skeleton className="h-6 w-32" /> {/* Card title */}
					<Skeleton className="h-4 w-64" /> {/* Card description */}
				</div>

				{/* Card content skeleton */}
				<div className="p-6 pt-0 space-y-6">
					{/* Profile image/workspace logo section */}
					<div className="flex items-center gap-4">
						<Skeleton className="h-20 w-20 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-9 w-32" />
						</div>
					</div>

					{/* Form fields skeleton */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Skeleton className="h-4 w-16" /> {/* Label */}
							<Skeleton className="h-10 w-full" /> {/* Input */}
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-20" /> {/* Label */}
							<Skeleton className="h-10 w-full" /> {/* Input */}
						</div>
					</div>

					<div className="space-y-2">
						<Skeleton className="h-4 w-24" /> {/* Label */}
						<Skeleton className="h-10 w-full" /> {/* Input */}
						<Skeleton className="h-3 w-48" /> {/* Description */}
					</div>
				</div>

				{/* Card footer skeleton */}
				<div className="flex items-center p-6 pt-0 gap-2">
					<Skeleton className="h-10 w-20" /> {/* Save button */}
					<Skeleton className="h-10 w-20" /> {/* Cancel/Delete button */}
				</div>
			</div>

			{/* Additional action card skeleton (for delete sections) */}
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
				<div className="flex flex-col space-y-1.5 p-6">
					<Skeleton className="h-6 w-40" /> {/* Danger section title */}
					<Skeleton className="h-4 w-80" /> {/* Danger description */}
				</div>
				<div className="p-6 pt-0">
					<Skeleton className="h-10 w-32" /> {/* Danger action button */}
				</div>
			</div>
		</div>
	);
};
