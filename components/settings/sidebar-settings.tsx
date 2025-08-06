"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		title: string;
	}[];
}

export const SidebarSettings = ({
	className,
	items,
	...props
}: SidebarNavProps) => {
	const pathname = usePathname();

	return (
		<nav
			className={cn(
				"flex space-x-2 overflow-x-auto text-sm text-muted-foreground border-b border-border",
				className,
			)}
			{...props}
		>
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						"text-sm group flex p-3 justify-start cursor-pointer hover:text-foreground transition",
						pathname === item.href
							? "text-foreground border-b-2 border-primary"
							: "text-muted-foreground",
					)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	);
};
