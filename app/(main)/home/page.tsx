"use client";

import { ChartAreaInteractive } from "@/components/home/chart-area-interactive";
import { DataTable } from "@/components/home/data-table";
import { SectionCards } from "@/components/home/section-cards";
import { EmptyWorkspaceState } from "@/components/workspace/empty-workspace-state";
import { useWorkspace } from "@/hooks/use-workspace";

export default function Page() {
	const { workspace, isLoading } = useWorkspace();

	// Show workspace empty state if no workspace exists
	if (!isLoading && !workspace) {
		return (
			<div className="flex-1 h-[calc(100vh-80px)] p-6">
				<EmptyWorkspaceState />
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<SectionCards />
					<div className="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div>
					<DataTable />
				</div>
			</div>
		</div>
	);
}
