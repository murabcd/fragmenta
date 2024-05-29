"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";

import { MoreHorizontal } from "lucide-react";

import { FormCardOverlay } from "./overlay";
import { FormCardFooter } from "./footer";

import { FormActions } from "@/components/form-actions";

import { formatDistanceToNow } from "date-fns";

import { useAuth } from "@clerk/nextjs";

interface FormCardProps {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  orgId: string;
  isPublished: boolean;
}

export const FormCard = ({
  id,
  title,
  authorId,
  authorName,
  createdAt,
  orgId,
  isPublished,
}: FormCardProps) => {
  const { userId } = useAuth();
  const authorLabel =
    userId === authorId ? "Modified by me" : `Modified by ${authorName}`;
  const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <Link href={`/form/${id}`}>
      <div className="group aspect-[100/127] border shadow-sm rounded-lg flex flex-col justify-between overflow-hidden relative">
        <div className="relative flex-1 bg-background">
          {/* TODO: Try to add images to the overlay */}
          <FormCardOverlay />
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
        </div>
        <FormCardFooter
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={() => {}}
        />
      </div>
    </Link>
  );
};

FormCard.Skeleton = function FormCardSkeleton() {
  return (
    <div className="aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
