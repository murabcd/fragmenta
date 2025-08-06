"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useSearch } from "@/hooks/use-search";
import { api } from "@/convex/_generated/api";
import { Circle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarInput,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";

// The main search dialog component
export function SearchCommand() {
	const router = useRouter();
	const data = useQuery(api.forms.search, { searchTerm: undefined });
	const [isMounted, setIsMounted] = useState(false);

	const isOpen = useSearch((store) => store.isOpen);
	const onOpen = useSearch((store) => store.onOpen);
	const onClose = useSearch((store) => store.onClose);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const down = (event: KeyboardEvent) => {
			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				onOpen();
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [onOpen]);

	const onSelect = (id: string) => {
		router.push(`/form/${id}`);
		onClose();
	};

	if (!isMounted) {
		return null;
	}

	return (
		<CommandDialog open={isOpen} onOpenChange={onClose}>
			<CommandInput placeholder="Search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				{data && data.length > 0 && (
					<CommandGroup heading="Forms">
						{data.map((form) => (
							<CommandItem
								key={form._id}
								id={form._id}
								title={form.title}
								value={`${form._id}-${form.title}`}
								onSelect={() => onSelect(form._id)}
							>
								<Circle className="mr-2 h-4 w-4" />
								<span>{form.title}</span>
							</CommandItem>
						))}
					</CommandGroup>
				)}
			</CommandList>
		</CommandDialog>
	);
}

// The sidebar trigger component
export function SearchToggleCommand() {
	const search = useSearch();
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	if (isCollapsed) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 mx-auto mb-2"
							onClick={() => search.onOpen()}
						>
							<Search className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right">
						<div className="flex items-center gap-2">
							<span>Search</span>
							<kbd className="flex-none select-none items-center gap-1 rounded border bg-muted/50 px-1.5 font-mono text-[10px] font-medium opacity-100 flex">
								<span className="text-xs">⌘</span>K
							</kbd>
						</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return (
		<SidebarGroup className="py-0 mb-2">
			<SidebarGroupContent className="relative">
				<Label htmlFor="search" className="sr-only">
					Search
				</Label>
				<SidebarInput
					id="search"
					placeholder="Search..."
					className="pl-8 pr-12 cursor-pointer"
					readOnly
					onClick={() => search.onOpen()}
				/>
				<Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
				<kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1 rounded border bg-muted/50 px-1.5 font-mono text-[10px] font-medium opacity-60 select-none">
					<span className="text-xs">⌘</span>K
				</kbd>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
