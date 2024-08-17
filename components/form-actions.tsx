"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { useRenameModal } from "@/hooks/use-rename-modal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmModal } from "./confirm-modal";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface FormActionsProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
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
  const { mutate, pending } = useApiMutation(api.forms.remove);
  const { onOpen } = useRenameModal();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
          <DropdownMenuItem onClick={() => onOpen(id, title)}>Rename</DropdownMenuItem>
          <DropdownMenuItem onClick={onCopyLink}>Copy link</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsDeleteModalOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmModal
        header="Delete Form"
        description="Are you sure you want to delete this form? This action cannot be undone."
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDelete}
      />
    </>
  );
};
