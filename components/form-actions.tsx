"use client";

import { toast } from "sonner";

import { useRenameModal } from "@/hooks/use-rename-modal";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface FormActionsProps {
  children: React.ReactNode;
  id: string;
  title: string;
}

export const FormActions = ({ children, id, title }: FormActionsProps) => {
  const { mutate, pending } = useApiMutation(api.form.remove);
  const { onOpen } = useRenameModal();

  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/form/${id}`)
      .then(() => toast.success("Link copied"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const onDelete = () => {
    mutate({ id })
      .then(() => toast.success("Form deleted"))
      .catch(() => toast.error("Failed to delete form"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(event) => event.stopPropagation()}
        align="end"
        side="right"
        className="w-[160px]"
      >
        <DropdownMenuItem onClick={() => onOpen(id, title)}>
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyLink}>Copy link</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
