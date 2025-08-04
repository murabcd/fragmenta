import { Suspense } from "react";

import { Canvas } from "./_components/canvas";

import Loading from "./loading";

interface FormIdPageProps {
	params: Promise<{
		formId: string;
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
