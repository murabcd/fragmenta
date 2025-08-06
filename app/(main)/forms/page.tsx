"use client";

import { FormItem } from "@/components/forms/form-item";
import { useWorkspace } from "@/hooks/use-workspace";

const FormsPage = () => {
	const { workspace } = useWorkspace();

	return (
		<div className="flex-1 h-[calc(100vh-80px)] p-6">
			<FormItem orgId={workspace?._id} />
		</div>
	);
};

export default FormsPage;
