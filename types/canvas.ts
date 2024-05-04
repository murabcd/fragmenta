export interface Question {
  _id: string;
  title: string;
  description?: string;
  type: QuestionType;
  formId: string;
}

export enum QuestionType {
  ShortText = "Short text",
  LongText = "Long text",
  YesNoChoice = "Yes/No choice",
  MultipleChoice = "Multiple choice",
  Rating = "Rating",
}
