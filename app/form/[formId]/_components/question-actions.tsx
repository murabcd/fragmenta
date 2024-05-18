"use client";

import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface QuestionActionsProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const QuestionActions = ({
  children,
  align,
  side,
  sideOffset,
  id,
}: QuestionActionsProps) => {
  const { mutate: removeQuestion } = useApiMutation(api.question.remove);
  const { mutate: duplicateQuestion } = useApiMutation(api.question.duplicate);

  const onDuplicate = () => {
    duplicateQuestion({ id })
      .then(() => toast.success("Question duplicated"))
      .catch(() => toast.error("Failed to duplicate question"));
  };

  const onDelete = () => {
    removeQuestion({ id })
      .then(() => {
        toast.success("Question deleted");
      })
      .catch(() => toast.error("Failed to delete question"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(event) => event.stopPropagation()}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="w-[160px]"
      >
        <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
