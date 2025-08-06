"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Plus, LoaderCircle } from "lucide-react";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface NewFormButtonProps {
	orgId: Id<"workspaces"> | undefined;
	disabled?: boolean;
}

export const NewFormButton = ({ orgId, disabled }: NewFormButtonProps) => {
	const router = useRouter();
	const { mutate, pending } = useApiMutation(api.forms.createForm);

	const onClick = () => {
		if (!orgId) return;

		mutate({
			orgId,
			title: "Untitled",
		})
			.then((id) => {
				router.push(`/form/${id}`);
				toast.success("Form created");
			})
			.catch(() => toast.error("Failed to create form"));
	};

	return (
		<Button
			onClick={onClick}
			disabled={pending || disabled || !orgId}
			className={cn(
				(pending || disabled || !orgId) &&
					"opacity-75 hover:bg-gray-600 cursor-not-allowed",
			)}
		>
			{pending ? (
				<LoaderCircle className="animate-spin w-4 h-4 mr-2" />
			) : (
				<Plus className="w-4 h-4 mr-2" />
			)}
			New form
		</Button>
	);
};
