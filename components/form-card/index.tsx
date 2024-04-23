"use client";

import Link from "next/link";

import { FormCardOverlay } from "./overlay";
import { FormCardFooter } from "./footer";

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
      <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden relative">
        <div className="relative flex-1 bg-secondary">
          {/* Try to add images to the overlay */}
          <FormCardOverlay />
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
