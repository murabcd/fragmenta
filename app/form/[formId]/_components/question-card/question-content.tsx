"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Question } from "@/types/canvas";

interface QuestionContentProps {
  question: Question;
}

export const QuestionContent = ({ question }: QuestionContentProps) => {
  return (
    <Card className="flex flex-col items-center justify-center h-[600px] w-full max-w-4xl p-4 bg-secondary shadow-md rounded-lg space-y-4">
      <Input
        className="bg-primary-foreground hover:bg-primary/10"
        value={question.title}
      />
      <Input
        className="bg-primary-foreground hover:bg-primary/10"
        value={question.description}
      />
      <Textarea
        className="bg-primary-foreground hover:bg-primary/10 resize-none"
        value={question.type}
      />
    </Card>
  );
};
