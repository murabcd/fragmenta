"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { useCompletion } from "ai/react";

import { Sparkles, LoaderCircle, WandSparkles } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
});

interface GenerateQuestionsProps {
  formId: string;
}

export const GenerateQuestions = ({ formId }: GenerateQuestionsProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { complete, isLoading } = useCompletion({
    api: `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/generate`,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await complete(values.prompt, { body: { formId } });
      toast.success("Questions generated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate questions");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-40 h-40 border rounded-lg hover:bg-accent flex flex-col items-center justify-center py-6">
          <Sparkles className="w-6 h-6 mb-2 text-purple-500" />
          <p className="text-sm font-light">Create with AI</p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Generate custom questions with AI</DialogTitle>
          <DialogDescription>
            Describe the form you have in mind and AI will do the magic.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., create a feedback survey for a new product launch"
                        autoFocus
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      AI can make mistakes. Check important info.
                    </FormDescription>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                {isLoading ? (
                  <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <WandSparkles className="w-4 h-4 mr-2" />
                )}
                Generate
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
