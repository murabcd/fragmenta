"use client";

import type { Table } from "@tanstack/react-table";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTableViewOptions } from "./data-table-view-options";

export const schema = z.object({
	_id: z.string(),
	title: z.string(),
	name: z.string(),
	wsId: z.string(),
	isPublished: z.boolean(),
	_creationTime: z.number(),
	responseCount: z.number().optional(),
	lastResponseTime: z.number().optional(),
});

interface DataTableTabsProps<TData> {
	table: Table<TData>;
	publishedCount: number;
	draftCount: number;
}

export function DataTableTabs<TData>({
	table,
	publishedCount,
	draftCount,
}: DataTableTabsProps<TData>) {
	return (
		<div className="flex items-center justify-between px-4 lg:px-6">
			<Label htmlFor="view-selector" className="sr-only">
				View
			</Label>
			<Select defaultValue="all">
				<SelectTrigger
					className="flex w-fit @4xl/main:hidden"
					size="sm"
					id="view-selector"
				>
					<SelectValue placeholder="Select a view" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All forms</SelectItem>
					<SelectItem value="published">Published</SelectItem>
					<SelectItem value="drafts">Drafts</SelectItem>
				</SelectContent>
			</Select>
			<TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
				<TabsTrigger value="all">All forms</TabsTrigger>
				<TabsTrigger value="published">
					Published{" "}
					{publishedCount > 0 && (
						<Badge variant="secondary">{publishedCount}</Badge>
					)}
				</TabsTrigger>
				<TabsTrigger value="drafts">
					Drafts{" "}
					{draftCount > 0 && <Badge variant="secondary">{draftCount}</Badge>}
				</TabsTrigger>
			</TabsList>
			<div className="flex items-center gap-2">
				<DataTableViewOptions table={table} />
			</div>
		</div>
	);
}
