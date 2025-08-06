"use client";

import { Loader } from "lucide-react";

import { FormItem } from "./_components/form-item";

import { EmptyWorkspaceState } from "@/components/empty-workspace-state";

import { useWorkspace } from "@/hooks/use-workspace";

const HomePage = () => {
	const { workspace, isLoading } = useWorkspace();

	if (isLoading) {
		return (
			<div className="flex-1 h-[calc(100vh-80px)] flex items-center justify-center">
				<Loader className="h-6 w-6 text-muted-foreground animate-spin duration-700" />
			</div>
		);
	}

	return (
		<div className="flex-1 h-[calc(100vh-80px)] p-6">
			{!workspace?._id ? (
				<EmptyWorkspaceState />
			) : (
				<FormItem orgId={workspace._id} />
			)}
		</div>
	);
};

export default HomePage;
