"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import { QuestionContent } from "@/components/questions/question-content";

import type { Doc } from "@/convex/_generated/dataModel";

import { cn } from "@/lib/utils";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface FormIdPagePublishedProps {
	params: Promise<{
		formd: Id<"forms">;
	}>;
}

const FormIdPagePublished = ({ params }: FormIdPagePublishedProps) => {
	const router = useRouter();
	const [formId, setFormId] = useState<string | null>(null);

	const updateResponse = useMutation(api.questions.submitQuestionResponse);

	const [positionIndex, setPositionIndex] = useState(0);
	const [responses, setResponses] = useState<Record<string, string | string[]>>(
		{},
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		params.then(({ formd }) => setFormId(formd));
	}, [params]);

	const form = useQuery(
		api.forms.getFormById,
		formId ? { id: formId as Id<"forms"> } : "skip",
	);

	const questions = useQuery(
		api.questions.getPublishedQuestions,
		formId ? { formId: formId as Id<"forms"> } : "skip",
	) as Doc<"questions">[];

	if (!formId) {
		return null;
	}

	if (form === null || (form && !form.isPublished)) {
		notFound();
	}

	const isQuestionAnswered = (question: Doc<"questions">) => {
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

		updateResponse({
			questionId: id as Id<"questions">,
			formId: formId as Id<"forms">,
			response,
		});
	};

	const progress =
		questions && questions.length > 0
			? ((positionIndex + 1) / questions.length) * 100
			: 0;

	if (!form || !questions) {
		return null;
	}

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<div className="w-full h-2.5 p-3">
				<Progress
					className="h-2 rounded-full transition-all duration-300"
					value={progress}
				/>
			</div>
			<div className="flex-grow flex items-center justify-center w-full">
				<div className="w-full h-full flex items-center justify-center px-8">
					<div
						className={cn(
							"transition-opacity duration-300 w-full max-w-5xl",
							"opacity-100",
						)}
					>
						<QuestionContent
							question={questions[positionIndex]}
							key={questions[positionIndex]._id}
							newTitle={questions[positionIndex].title}
							newDescription={questions[positionIndex].description || ""}
							newResponse={responses[questions[positionIndex]._id] || ""}
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
