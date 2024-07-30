"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { FormCard } from "@/components/form-card";

import { EmptyHomeState } from "./empty-home-state";

import { NewFormButton } from "@/components/new-form-button";

import { Id } from "@/convex/_generated/dataModel";

interface FormItemProps {
  orgId: Id<"organizations">;
}

export const FormItem = ({ orgId }: FormItemProps) => {
  const data = useQuery(api.forms.getAll, { orgId });

  if (data === undefined) {
    return (
      <div>
        <NewFormButton orgId={orgId} disabled />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <FormCard.Skeleton />
          <FormCard.Skeleton />
          <FormCard.Skeleton />
          <FormCard.Skeleton />
          <FormCard.Skeleton />
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return <EmptyHomeState />;
  }

  return (
    <div>
      <NewFormButton orgId={orgId} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        {data?.map((form) => (
          <FormCard
            key={form._id}
            id={form._id}
            title={form.title}
            userId={form.userId as Id<"users">}
            name={form.name}
            createdAt={form._creationTime}
            orgId={form.orgId}
            isPublished={form.isPublished}
          />
        ))}
      </div>
    </div>
  );
};
