"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ChevronLeft, Menu } from "lucide-react";

import { Hint } from "@/components/hint";

import { FormActions } from "@/components/form-actions";

import { useRenameModal } from "@/hooks/use-rename-modal";

import { FormPreview } from "@/components/form-preview";
import { Publish } from "@/components/publish";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface InfoProps {
  formId: string;
}

const TabSeparator = () => {
  return <div className="text-neutral-300 px-1">|</div>;
};

export const Info = ({ formId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.form.get, {
    id: formId as Id<"forms">,
  });

  if (!data) return;

  return (
    <div className="flex flex-row items-center justify-between space-x-2 py-2 px-4 h-16">
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Hint label="Back to forms" side="bottom" sideOffset={10}>
          <Link href="/home">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
        </Hint>
        <TabSeparator />
        <Hint label="Rename" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            className="text-base font-medium px-1 max-w-[150px] sm:max-w-[300px]"
            onClick={() => onOpen(data._id, data.title)}
          >
            <span className="truncate">{data.title}</span>
          </Button>
        </Hint>
        <TabSeparator />
        <FormActions id={data._id} title={data.title} side="bottom" sideOffset={10}>
          <div>
            <Hint label="Main menu" align="end" side="bottom" sideOffset={10}>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </Hint>
          </div>
        </FormActions>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <FormPreview formId={formId} />
        <Publish formId={data._id} />
      </div>
    </div>
  );
};
