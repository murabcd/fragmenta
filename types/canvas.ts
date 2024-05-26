export interface Question {
  _id: string;
  title: string;
  description?: string;
  type: QuestionType;
  choices: string[];
  position: number;
  formId: string;
}

export enum QuestionType {
  Short = "Short text",
  Long = "Long text",
  Single = "Single choice",
  Multiple = "Multiple choice",
  Rating = "Rating",
}
