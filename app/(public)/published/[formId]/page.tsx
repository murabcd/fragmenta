"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import { QuestionContent } from "@/components/question-content";

import { useDebounce, useDebouncedCallback } from "use-debounce";

import { Question } from "@/types/canvas";

import { cn } from "@/lib/utils";

import { useQuery } from "convex/react";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface FormIdPagePublishedProps {
	params: Promise<{
		formId: string;
	}>;
}

const FormIdPagePublished = ({ params }: FormIdPagePublishedProps) => {
	const router = useRouter();
	const [formId, setFormId] = useState<string | null>(null);

	const { mutate: updateResponse } = useApiMutation(api.questions.response);

	const [positionIndex, setPositionIndex] = useState(0);
	const [debouncedPositionIndex] = useDebounce(positionIndex, 300);
	const [responses, setResponses] = useState<Record<string, string | string[]>>(
		{},
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		params.then(({ formId }) => setFormId(formId));
	}, [params]);

	const form = useQuery(api.forms.get, {
		id: formId as Id<"forms">,
	});

	const questions = useQuery(api.questions.published, {
		formId: formId as Id<"forms">,
	}) as Question[];

	const debouncedUpdateResponse = useDebouncedCallback(
		(
			questionId: Id<"questions">,
			formId: Id<"forms">,
			response: string | string[],
		) => {
			updateResponse({
				questionId,
				formId,
				response,
			});
		},
		500,
	);

	if (!formId) {
		return null;
	}

	if (form === null || (form && !form.isPublished)) {
		notFound();
	}

	const isQuestionAnswered = (question: Question) => {
		const response = responses[question._id];
		if (question.isRequired) {
			if (Array.isArray(response)) {
				return response.length > 0;
			}
			return !!response;
		}
		return true;
	};

	const handleBack = () => {
		if (questions && positionIndex > 0) {
			setPositionIndex(positionIndex - 1);
			setError(null);
		}
	};

	const handleForward = () => {
		if (questions && positionIndex < questions.length - 1) {
			const currentQuestion = questions[positionIndex];
			if (isQuestionAnswered(currentQuestion)) {
				setPositionIndex(positionIndex + 1);
				setError(null);
			} else {
				setError("Please fill this in");
			}
		}
	};

	const handleComplete = () => {
		router.push("/");
	};

	const handleResponseChange = (id: string, response: string | string[]) => {
		setResponses((prev) => ({ ...prev, [id]: response }));

		debouncedUpdateResponse(
			id as Id<"questions">,
			formId as Id<"forms">,
			response,
		);
	};

	const progress =
		questions && questions.length > 0
			? ((positionIndex + 1) / questions.length) * 100
			: 0;

	if (!form || !questions) {
		return null;
	}

	return (
		<div className="min-h-screen flex flex-col">
			<div className="w-full h-2.5 p-3">
				<Progress
					className="h-2 rounded-full transition-all duration-300"
					value={progress}
				/>
			</div>
			<div className="flex-grow flex items-center justify-center px-4">
				<div className="w-full max-w-[720px]">
					<div
						className={cn(
							"transition-opacity duration-300",
							debouncedPositionIndex !== positionIndex
								? "opacity-0"
								: "opacity-100",
						)}
					>
						<QuestionContent
							question={questions[debouncedPositionIndex]}
							key={questions[debouncedPositionIndex]._id}
							newTitle={questions[debouncedPositionIndex].title}
							newDescription={
								questions[debouncedPositionIndex].description || ""
							}
							newResponse={
								responses[questions[debouncedPositionIndex]._id] || ""
							}
							onTitleChange={() => {}}
							onDescriptionChange={() => {}}
							onResponseChange={handleResponseChange}
							updateChoices={() => Promise.resolve()}
							onStart={handleForward}
							onComplete={handleComplete}
							onBack={handleBack}
							onForward={handleForward}
							isBackDisabled={positionIndex === 0}
							isForwardDisabled={positionIndex === questions.length - 1}
							isPreview={true}
							isPublished={true}
							error={error}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FormIdPagePublished;
