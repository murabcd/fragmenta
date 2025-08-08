"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface NewFormButtonProps {
	wsId: Id<"workspaces"> | undefined;
	disabled?: boolean;
}

export const NewFormButton = ({ wsId, disabled }: NewFormButtonProps) => {
	const create = useMutation(api.forms.createForm);
	const router = useRouter();

	const handleCreate = async () => {
		if (!wsId) return;

		try {
			const formId = await create({
				title: "Untitled Form",
				wsId,
			});

			toast.success("Form created");

			router.push(`/form/${formId}`);
		} catch (error) {
			toast.error("Failed to create form");
		}
	};

	return (
		<Button
			onClick={handleCreate}
			disabled={disabled || !wsId}
			size="sm"
			className="h-8"
		>
			<Plus className="mr-2 h-4 w-4" />
			New Form
		</Button>
	);
};
