"use client";

import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface MemberActionsProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  type: "member" | "invitation";
}

export const MemberActions = ({
  children,
  align,
  side,
  sideOffset,
  id,
  type,
}: MemberActionsProps) => {
  const { mutate: removeMember } = useApiMutation(api.members.remove);
  const { mutate: removeInvitation } = useApiMutation(api.invitations.remove);

  const onDelete = () => {
    const promise = type === "member" ? removeMember({ id }) : removeInvitation({ id });

    toast.promise(promise, {
      loading: `Removing ${type}...`,
      success: `${type === "member" ? "Member" : "Invitation"} removed`,
      error: `Failed to remove ${type}`,
    });
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
        <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
