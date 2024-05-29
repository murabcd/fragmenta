"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Plus, LoaderCircle, Home } from "lucide-react";

import { useOrganization } from "@clerk/nextjs";
import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

export const EmptyHomeState = () => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { mutate, pending } = useApiMutation(api.form.create);

  const onClick = () => {
    if (!organization) return;

    mutate({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((id) => {
        router.push(`/form/${id}`);
        toast.success("Form created");
      })
      .catch(() => {
        toast.error("Failed to create form");
      });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Home className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-semibold mt-6">Create your first form</h2>
      <p className="text-muted-foreground text-sm mt-2">
        You haven&apos;t created any forms yet.
      </p>
      <div className="mt-6">
        <Button onClick={onClick} disabled={pending}>
          {pending ? (
            <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Create form
        </Button>
      </div>
    </div>
  );
};
