"use client";

import * as React from "react";
import {
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type Row,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import type { z } from "zod";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableTabs } from "./data-table-tabs";
import { columns, type schema } from "./data-table-columns";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useWorkspace } from "@/hooks/use-workspace";
import { Loader } from "lucide-react";

// Remove DraggableRow, use normal TableRow
function DataTableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
	return (
		<TableRow data-state={row.getIsSelected() && "selected"}>
			{row.getVisibleCells().map((cell) => (
				<TableCell key={cell.id}>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</TableCell>
			))}
		</TableRow>
	);
}

export function DataTable() {
	const { workspace } = useWorkspace();
	const [activeTab, setActiveTab] = React.useState("all");

	// Fetch real forms data
	const forms = useQuery(
		api.forms.getFormsByWorkspace,
		workspace?._id ? { orgId: workspace._id } : "skip",
	);

	// Fetch response stats for each form
	const responseStats = useQuery(
		api.forms.getFormResponseStats,
		workspace?._id ? { orgId: workspace._id } : "skip",
	);

	// Transform the data to match our schema
	const data = React.useMemo(() => {
		if (!forms) return [];

		return forms.map((form) => {
			// Calculate response count for this form
			const formResponseStats = responseStats?.responseStats[form._id] || {};
			const responseCount = Object.values(formResponseStats).reduce(
				(sum, count) => sum + count,
				0,
			);

			// Find last response time for this form
			let lastResponseTime: number | undefined;
			if (Object.keys(formResponseStats).length > 0) {
				const lastResponseDate = Object.keys(formResponseStats).sort().pop();
				if (lastResponseDate) {
					lastResponseTime = new Date(lastResponseDate).getTime();
				}
			}

			return {
				_id: form._id,
				title: form.title,
				name: form.name,
				orgId: form.orgId,
				isPublished: form.isPublished,
				_creationTime: form._creationTime,
				responseCount,
				lastResponseTime,
			};
		});
	}, [forms, responseStats]);

	// Filter data based on active tab
	const filteredData = React.useMemo(() => {
		switch (activeTab) {
			case "published":
				return data.filter((form) => form.isPublished);
			case "drafts":
				return data.filter((form) => !form.isPublished);
			default:
				return data;
		}
	}, [data, activeTab]);

	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const table = useReactTable({
		data: filteredData,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		getRowId: (row) => row._id,
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	// Calculate real counts
	const publishedCount = data.filter((form) => form.isPublished).length;
	const draftCount = data.filter((form) => !form.isPublished).length;

	if (forms === undefined) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader className="h-6 w-6 animate-spin" />
			</div>
		);
	}

	return (
		<Tabs
			defaultValue="all"
			className="w-full flex-col justify-start gap-6"
			onValueChange={setActiveTab}
		>
			<DataTableTabs
				table={table}
				publishedCount={publishedCount}
				draftCount={draftCount}
			/>
			<TabsContent
				value="all"
				className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
			>
				<div className="overflow-hidden rounded-lg border">
					<Table>
						<TableHeader className="bg-muted sticky top-0 z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="**:data-[slot=table-cell]:first:w-8">
							{table.getRowModel().rows?.length ? (
								table
									.getRowModel()
									.rows.map((row) => <DataTableRow key={row.id} row={row} />)
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No forms found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<DataTablePagination table={table} />
			</TabsContent>
			<TabsContent value="published" className="flex flex-col px-4 lg:px-6">
				<div className="overflow-hidden rounded-lg border">
					<Table>
						<TableHeader className="bg-muted sticky top-0 z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="**:data-[slot=table-cell]:first:w-8">
							{table.getRowModel().rows?.length ? (
								table
									.getRowModel()
									.rows.map((row) => <DataTableRow key={row.id} row={row} />)
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No published forms found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<DataTablePagination table={table} />
			</TabsContent>
			<TabsContent value="drafts" className="flex flex-col px-4 lg:px-6">
				<div className="overflow-hidden rounded-lg border">
					<Table>
						<TableHeader className="bg-muted sticky top-0 z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="**:data-[slot=table-cell]:first:w-8">
							{table.getRowModel().rows?.length ? (
								table
									.getRowModel()
									.rows.map((row) => <DataTableRow key={row.id} row={row} />)
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No draft forms found.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<DataTablePagination table={table} />
			</TabsContent>
		</Tabs>
	);
}
