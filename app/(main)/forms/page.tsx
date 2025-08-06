"use client";

import { Loader } from "lucide-react";
import { FormItem } from "@/components/forms/form-item";
import { EmptyHomeState } from "@/components/forms/empty-home-state";
import { useWorkspace } from "@/hooks/use-workspace";

const FormsPage = () => {
	const { workspace } = useWorkspace();

	if (!workspace?._id) {
		return (
			<div className="flex-1 h-[calc(100vh-80px)] flex items-center justify-center">
				<Loader className="h-6 w-6 text-muted-foreground animate-spin duration-700" />
			</div>
		);
	}

	return (
		<div className="flex-1 h-[calc(100vh-80px)] p-6">
			{!workspace?._id ? (
				<EmptyHomeState />
			) : (
				<FormItem orgId={workspace._id} />
			)}
		</div>
	);
};

export default FormsPage;
