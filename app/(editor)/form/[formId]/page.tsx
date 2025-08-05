import { Suspense } from "react";

import { Canvas } from "./_components/canvas";

import Loading from "./loading";

import type { Id } from "@/convex/_generated/dataModel";

interface FormIdPageProps {
	params: Promise<{
		formId: Id<"forms">;
	}>;
}

const FormIdPage = async ({ params }: FormIdPageProps) => {
	const { formId } = await params;

	return (
		<Suspense fallback={<Loading />}>
			<Canvas formId={formId} />
		</Suspense>
	);
};

export default FormIdPage;
