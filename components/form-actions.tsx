"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmModal } from "./confirm-modal";
import { RenameModal } from "./rename-modal";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface FormActionsProps {
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	side?: DropdownMenuContentProps["side"];
	sideOffset?: DropdownMenuContentProps["sideOffset"];
	id: Id<"forms">;
	title: string;
}

export const FormActions = ({
	children,
	align,
	side,
	sideOffset,
	id,
	title,
}: FormActionsProps) => {
	const router = useRouter();
	const { mutate, pending } = useApiMutation(api.forms.deleteForm);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

	const onCopyLink = () => {
		navigator.clipboard
			.writeText(`${window.location.origin}/form/${id}`)
			.then(() => toast.success("Link copied"))
			.catch(() => toast.error("Failed to copy link"));
	};

	const onDelete = () => {
		const promise = mutate({ id });

		toast.promise(promise, {
			loading: "Deleting...",
			success: "Form deleted",
			error: "Failed to delete form",
		});

		promise.then(() => {
			router.push("/home");
		});
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent
					onClick={(event) => event.stopPropagation()}
					align={align}
					side={side}
					sideOffset={sideOffset}
					className="w-[160px]"
				>
					<DropdownMenuItem onClick={() => setIsRenameModalOpen(true)}>
						Rename
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onCopyLink}>Copy link</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onSelect={() => setIsDeleteModalOpen(true)}>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<RenameModal
				isOpen={isRenameModalOpen}
				onClose={() => setIsRenameModalOpen(false)}
				id={id}
				title={title}
			/>
			<ConfirmModal
				header="Are you absolutely sure?"
				description="This action cannot be undone. This will permanently delete your form and remove your data from our servers."
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={onDelete}
			/>
		</>
	);
};
