import { create } from "zustand";
import type { Id, Doc } from "@/convex/_generated/dataModel";

interface FormEditorState {
	// Current form and questions
	formId: Id<"forms"> | null;
	questions: Doc<"questions">[] | null;

	// Currently selected question
	selectedQuestion: Doc<"questions"> | null;

	// Form field states
	newTitle: string;
	newDescription: string;
	newResponse: string | string[];
	newType: string;

	// Mutation functions (will be injected)
	mutations: {
		updateTitle?: (args: {
			id: Id<"questions">;
			title: string;
		}) => Promise<unknown>;
		updateDescription?: (args: {
			id: Id<"questions">;
			description: string;
		}) => Promise<unknown>;
		updateChoices?: (args: {
			id: Id<"questions">;
			choices: string[];
		}) => Promise<unknown>;
		updateType?: (args: {
			id: Id<"questions">;
			type: string;
		}) => Promise<unknown>;
		updateRequired?: (args: {
			id: Id<"questions">;
			isRequired: boolean;
		}) => Promise<unknown>;
		updateImage?: (args: {
			id: Id<"questions">;
			image?: string;
		}) => Promise<unknown>;
		updateImageLayout?: (args: {
			id: Id<"questions">;
			imageLayout: {
				mobile: "center" | "top" | "fill-top";
				desktop: "left" | "center" | "right" | "fill-left" | "fill-right";
			};
		}) => Promise<unknown>;
		updateImageFocalPoint?: (args: {
			id: Id<"questions">;
			focalPoint?: { x: number; y: number };
		}) => Promise<unknown>;
	};

	// Actions
	setFormId: (formId: Id<"forms">) => void;
	setQuestions: (questions: Doc<"questions">[]) => void;
	setSelectedQuestion: (question: Doc<"questions"> | null) => void;
	setNewTitle: (title: string) => void;
	setNewDescription: (description: string) => void;
	setNewResponse: (response: string | string[]) => void;
	setNewType: (type: string) => void;
	setMutations: (mutations: FormEditorState["mutations"]) => void;

	// Convenience methods
	selectQuestion: (question: Doc<"questions">) => void;
	resetFields: () => void;

	// Handler methods that use mutations
	handleTitleChange: (id: string, title: string) => void;
	handleDescriptionChange: (id: string, description: string) => void;
	handleResponseChange: (id: string, response: string | string[]) => void;
	handleUpdateChoices: (choices: {
		id: Id<"questions">;
		choices: string[];
	}) => Promise<void>;
	handleTypeChange: (id: string, newType: string) => Promise<void>;
	handleRequiredChange: (id: string, isRequired: boolean) => Promise<void>;
	handleImageChange: (id: string, imageUrl: string) => Promise<void>;
	handleLayoutChange: (
		id: string,
		layout: { mobile: string; desktop: string },
	) => Promise<void>;
	handleFocalPointChange: (
		id: string,
		focalPoint?: { x: number; y: number },
	) => Promise<void>;

	// Delete handling
	handleQuestionDeleted: (deletedId: Id<"questions">) => void;
}

export const useFormEditor = create<FormEditorState>((set, get) => ({
	// State
	formId: null,
	questions: null,
	selectedQuestion: null,
	newTitle: "",
	newDescription: "",
	newResponse: "",
	newType: "Short text",
	mutations: {},

	// Basic setters
	setFormId: (formId) => set({ formId }),
	setQuestions: (questions) => set({ questions }),
	setSelectedQuestion: (selectedQuestion) => set({ selectedQuestion }),
	setNewTitle: (newTitle) => set({ newTitle }),
	setNewDescription: (newDescription) => set({ newDescription }),
	setNewResponse: (newResponse) => set({ newResponse }),
	setNewType: (newType) => set({ newType }),
	setMutations: (mutations) => set({ mutations }),

	// Convenience methods
	selectQuestion: (question) =>
		set({
			selectedQuestion: question,
			newTitle: question.title,
			newDescription: question.description || "",
			newType: question.type,
		}),

	resetFields: () =>
		set({
			newTitle: "",
			newDescription: "",
			newResponse: "",
			newType: "Short text",
			selectedQuestion: null,
		}),

	// Handler methods that use mutations
	handleTitleChange: (id, title) => {
		const { mutations } = get();
		set({ newTitle: title });
		mutations.updateTitle?.({ id: id as Id<"questions">, title });
	},

	handleDescriptionChange: (id, description) => {
		const { mutations } = get();
		set({ newDescription: description });
		mutations.updateDescription?.({ id: id as Id<"questions">, description });
	},

	handleResponseChange: (_id, response) => {
		set({ newResponse: response });
	},

	handleUpdateChoices: async (choices) => {
		const { mutations } = get();
		await mutations.updateChoices?.({
			id: choices.id,
			choices: choices.choices,
		});
	},

	handleTypeChange: async (id, newType) => {
		const { mutations, selectedQuestion } = get();
		if (selectedQuestion) {
			set({
				selectedQuestion: { ...selectedQuestion, type: newType, choices: [] },
				newType,
			});

			try {
				// Update type first, then choices to avoid race conditions
				await mutations.updateType?.({
					id: id as Id<"questions">,
					type: newType,
				});
				await mutations.updateChoices?.({
					id: id as Id<"questions">,
					choices: [],
				});
			} catch (error) {
				// Revert on error
				set({ selectedQuestion });
				throw error;
			}
		}
	},

	handleRequiredChange: async (id, isRequired) => {
		const { mutations, selectedQuestion } = get();
		if (selectedQuestion) {
			const previousQuestion = { ...selectedQuestion };
			set({ selectedQuestion: { ...selectedQuestion, isRequired } });

			try {
				await mutations.updateRequired?.({
					id: id as Id<"questions">,
					isRequired,
				});
			} catch (error) {
				set({ selectedQuestion: previousQuestion });
				throw error;
			}
		}
	},

	handleImageChange: async (id, imageUrl) => {
		const { mutations, selectedQuestion, handleLayoutChange } = get();
		if (selectedQuestion) {
			const previousQuestion = { ...selectedQuestion };
			const updatedQuestion = {
				...selectedQuestion,
				image: imageUrl,
				imageLayout: { mobile: "center" as const, desktop: "center" as const },
			};
			set({ selectedQuestion: updatedQuestion });

			try {
				await mutations.updateImage?.({
					id: id as Id<"questions">,
					image: imageUrl || undefined,
				});
				await handleLayoutChange(id, { mobile: "center", desktop: "center" });
			} catch (error) {
				set({ selectedQuestion: previousQuestion });
				throw error;
			}
		}
	},

	handleLayoutChange: async (id, layout) => {
		const { mutations, selectedQuestion } = get();
		if (selectedQuestion) {
			const previousQuestion = { ...selectedQuestion };
			const imageLayout = {
				mobile: layout.mobile as "center" | "top" | "fill-top",
				desktop: layout.desktop as
					| "left"
					| "center"
					| "right"
					| "fill-left"
					| "fill-right",
			};
			const updatedQuestion = { ...selectedQuestion, imageLayout };
			set({ selectedQuestion: updatedQuestion });

			try {
				await mutations.updateImageLayout?.({
					id: id as Id<"questions">,
					imageLayout,
				});
			} catch (error) {
				set({ selectedQuestion: previousQuestion });
				throw error;
			}
		}
	},

	handleFocalPointChange: async (id, focalPoint) => {
		const { mutations, selectedQuestion } = get();
		if (selectedQuestion) {
			const previousQuestion = { ...selectedQuestion };
			const updatedQuestion = {
				...selectedQuestion,
				imageFocalPoint: focalPoint,
			};
			set({ selectedQuestion: updatedQuestion });

			try {
				await mutations.updateImageFocalPoint?.({
					id: id as Id<"questions">,
					focalPoint,
				});
			} catch (error) {
				set({ selectedQuestion: previousQuestion });
				throw error;
			}
		}
	},

	// Handle question deletion - update store when question is deleted
	handleQuestionDeleted: (deletedId) => {
		const { questions, selectedQuestion } = get();
		if (questions) {
			const updatedQuestions = questions.filter((q) => q._id !== deletedId);
			set({
				questions: updatedQuestions,
				selectedQuestion:
					selectedQuestion?._id === deletedId
						? updatedQuestions.length > 0
							? updatedQuestions[0]
							: null
						: selectedQuestion,
			});
		}
	},
}));
