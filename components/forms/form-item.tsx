"use client";

import { FormCard } from "@/components/forms/form-card";
import { EmptyFormsState } from "@/components/forms/empty-forms-state";
import { NewFormButton } from "@/components/buttons/new-form-button";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface FormItemProps {
	wsId: Id<"workspaces">;
}

export const FormItem = ({ wsId }: FormItemProps) => {
	const data = useQuery(api.forms.getFormsByWorkspace, { wsId });

	if (data === undefined) {
		return (
			<div>
				<NewFormButton wsId={wsId} disabled />
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
		return <EmptyFormsState />;
	}

	return (
		<div>
			<NewFormButton wsId={wsId} />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
				{data?.map((form) => (
					<FormCard
						key={form._id}
						id={form._id}
						title={form.title}
						userId={form.userId as Id<"users">}
						name={form.name}
						createdAt={form._creationTime}
						wsId={form.wsId}
						isPublished={form.isPublished}
					/>
				))}
			</div>
		</div>
	);
};
