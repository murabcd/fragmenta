"use client";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { FormCard } from "@/components/forms/form-card";

import { EmptyHomeState } from "./empty-home-state";

import { NewFormButton } from "@/components/buttons/new-form-button";

import type { Id } from "@/convex/_generated/dataModel";

interface FormItemProps {
	orgId: Id<"workspaces"> | undefined;
}

export const FormItem = ({ orgId }: FormItemProps) => {
	const data = useQuery(
		api.forms.getFormsByWorkspace,
		orgId ? { orgId } : "skip",
	);

	if (data === undefined) {
		return <FormItem.Skeleton orgId={orgId} />;
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

FormItem.Skeleton = function FormItemSkeleton({
	orgId,
}: {
	orgId: Id<"workspaces"> | undefined;
}) {
	return (
		<div>
			<NewFormButton orgId={orgId} disabled />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
				{Array.from({ length: 5 }, (_, i) => i).map((cardIndex) => (
					<FormCard.Skeleton key={`skeleton-form-${cardIndex}`} />
				))}
			</div>
		</div>
	);
};
