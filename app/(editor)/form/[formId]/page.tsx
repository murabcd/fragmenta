import { Canvas } from "./_components/canvas";

import type { Id } from "@/convex/_generated/dataModel";

interface FormIdPageProps {
	params: Promise<{
		formId: Id<"forms">;
	}>;
}

const FormIdPage = async ({ params }: FormIdPageProps) => {
	const { formId } = await params;

	return <Canvas formId={formId} />;
};

export default FormIdPage;
