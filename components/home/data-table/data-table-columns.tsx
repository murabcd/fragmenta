"use client";

import {
	MoreVertical,
	Eye,
	EyeOff,
	Edit,
	Trash2,
	Globe,
	GlobeLock,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { TableCellViewer } from "./data-table-cell-viewer";
import { FormDetailsDrawer } from "@/components/forms/form-details-drawer";
import type { Id } from "@/convex/_generated/dataModel";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export const schema = z.object({
	_id: z.string(),
	title: z.string(),
	name: z.string(),
	orgId: z.string(),
	isPublished: z.boolean(),
	_creationTime: z.number(),
	responseCount: z.number().optional(),
	lastResponseTime: z.number().optional(),
});

export const columns: ColumnDef<z.infer<typeof schema>>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex items-center justify-center">
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex items-center justify-center">
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "title",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Form title" />
		),
		cell: ({ row }) => {
			return <TableCellViewer item={row.original} />;
		},
		enableHiding: false,
	},
	{
		accessorKey: "isPublished",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({ row }) => (
			<Badge
				variant={row.original.isPublished ? "default" : "secondary"}
				className="px-1.5"
			>
				{row.original.isPublished ? (
					<>
						<Eye className="mr-1 h-3 w-3" />
						Published
					</>
				) : (
					<>
						<EyeOff className="mr-1 h-3 w-3" />
						Draft
					</>
				)}
			</Badge>
		),
	},
	{
		accessorKey: "name",
		header: () => <div className="w-full text-center">Author</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm text-muted-foreground">
				{row.original.name}
			</div>
		),
	},
	{
		accessorKey: "responseCount",
		header: () => <div className="w-full text-center">Responses</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm text-muted-foreground">
				{row.original.responseCount || 0}
			</div>
		),
	},
	{
		accessorKey: "lastResponseTime",
		header: () => <div className="w-full text-center">Last response</div>,
		cell: ({ row }) => (
			<div className="text-center text-sm text-muted-foreground">
				{row.original.lastResponseTime
					? new Date(row.original.lastResponseTime).toLocaleDateString()
					: "—"}
			</div>
		),
	},
	{
		accessorKey: "_creationTime",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
		cell: ({ row }) => (
			<div className="text-sm text-muted-foreground">
				{new Date(row.original._creationTime).toLocaleDateString()}
			</div>
		),
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const router = useRouter();
			const { mutate: deleteForm } = useApiMutation(api.forms.deleteForm);
			const { mutate: updateFormPublishStatus } = useApiMutation(
				api.forms.updateFormPublishStatus,
			);

			const handleDelete = () => {
				toast.promise(deleteForm({ id: row.original._id as Id<"forms"> }), {
					loading: "Deleting form...",
					success: "Form deleted",
					error: "Failed to delete form",
				});
			};

			const handleTogglePublish = () => {
				toast.promise(
					updateFormPublishStatus({
						id: row.original._id as Id<"forms">,
						isPublished: !row.original.isPublished,
					}),
					{
						loading: "Updating form...",
						success: row.original.isPublished
							? "Form unpublished"
							: "Form published",
						error: "Failed to update form",
					},
				);
			};

			const handleEdit = () => {
				router.push(`/form/${row.original._id}`);
			};

			const handleView = (e: Event) => {
				e.preventDefault();
				e.stopPropagation();
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
							size="icon"
						>
							<MoreVertical />
							<span className="sr-only">Open menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-32">
						<FormDetailsDrawer item={row.original}>
							<DropdownMenuItem onSelect={handleView}>
								<Eye className="mr-2 h-4 w-4" />
								View
							</DropdownMenuItem>
						</FormDetailsDrawer>
						<DropdownMenuItem onClick={handleEdit}>
							<Edit className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleTogglePublish}>
							{row.original.isPublished ? (
								<>
									<GlobeLock className="mr-2 h-4 w-4" />
									Unpublish
								</>
							) : (
								<>
									<Globe className="mr-2 h-4 w-4" />
									Publish
								</>
							)}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive" onClick={handleDelete}>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
