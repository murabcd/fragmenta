"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";

import { MoreHorizontal } from "lucide-react";

import { FormCardOverlay } from "./overlay";
import { FormCardFooter } from "./footer";

import { FormActions } from "@/components/form-actions";

import { formatDistanceToNow } from "date-fns";

import { useSession } from "next-auth/react";

import { Id } from "@/convex/_generated/dataModel";

interface FormCardProps {
  id: string;
  title: string;
  name: string;
  createdAt: number;
  userId: Id<"users">;
  orgId: Id<"organizations">;
  isPublished: boolean;
}

export const FormCard = ({
  id,
  title,
  userId,
  name,
  createdAt,
  orgId,
  isPublished,
}: FormCardProps) => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const authorLabel =
    session.user.id === userId ? "Modified by me" : `Modified by ${name}`;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <div className="group aspect-[100/127] border shadow-sm rounded-lg flex flex-col justify-between overflow-hidden relative">
      <Link href={`/form/${id}`} className="flex-1">
        <div className="relative flex-1 bg-background">
          <FormCardOverlay />
        </div>
      </Link>
      <FormActions id={id} title={title} align="end" side="right">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </FormActions>
      <Link href={`/form/${id}`}>
        <FormCardFooter
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={() => {}}
        />
      </Link>
    </div>
  );
};

FormCard.Skeleton = function FormCardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
