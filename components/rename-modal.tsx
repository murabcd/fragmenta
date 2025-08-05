"use client";

import { FormEventHandler, useEffect, useState } from "react";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "@/components/ui/dialog";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface RenameModalProps {
	isOpen: boolean;
	onClose: () => void;
	id: Id<"forms">;
	title: string;
}

export const RenameModal = ({
	isOpen,
	onClose,
	id,
	title,
}: RenameModalProps) => {
	const { mutate, pending } = useApiMutation(api.forms.updateFormTitle);

	const [newTitle, setNewTitle] = useState(title);

	useEffect(() => {
		setNewTitle(title);
	}, [title]);

	const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();

		mutate({
			id,
			title: newTitle,
		})
			.then(() => {
				toast.success("Form renamed");
				onClose();
			})
			.catch(() => toast.error("Failed to rename form"));
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rename form</DialogTitle>
					<DialogDescription>
						Enter a new form name. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={onSubmit} className="space-y-4">
					<Input
						id="form-title"
						name="form-title"
						disabled={pending}
						required
						maxLength={60}
						value={newTitle}
						onChange={(event) => setNewTitle(event.target.value)}
						placeholder="Form title"
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="ghost">
								Cancel
							</Button>
						</DialogClose>
						<Button disabled={pending} type="submit">
							Save
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
