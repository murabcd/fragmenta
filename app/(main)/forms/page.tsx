"use client";

import { FormItem } from "@/components/forms/form-item";
import { EmptyWorkspaceState } from "@/components/workspace/empty-workspace-state";
import { useWorkspace } from "@/hooks/use-workspace";
import type { Id } from "@/convex/_generated/dataModel";

const FormsPage = () => {
	const { workspace, isLoading } = useWorkspace();

	// Show workspace empty state if no workspace exists
	if (!isLoading && !workspace) {
		return (
			<div className="flex-1 h-[calc(100vh-80px)] p-6">
				<EmptyWorkspaceState />
			</div>
		);
	}

	if (!workspace) return null; // TypeScript safety

	return (
		<div className="flex-1 h-[calc(100vh-80px)] p-6">
			<FormItem wsId={workspace?._id as Id<"workspaces">} />
		</div>
	);
};

export default FormsPage;
