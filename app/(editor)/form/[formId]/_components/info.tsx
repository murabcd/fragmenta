"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ChevronLeft, Eye, Menu } from "lucide-react";

import { Hint } from "@/components/hint";

import { FormActions } from "@/components/form-actions";

import { useRenameModal } from "@/hooks/use-rename-modal";

import { FormViewer } from "./form-elements/form-viewer";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface InfoProps {
  formId: string;
}

const TabSeparator = () => {
  return <div className="text-neutral-300 px-2">|</div>;
};

export const Info = ({ formId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.form.get, {
    id: formId as Id<"forms">,
  });

  if (!data) return;

  return (
    <div className="flex flex-row items-center justify-between space-x-2 py-2 px-4 h-16">
      <Hint label="Back to forms" side="bottom" sideOffset={10}>
        <Link href="/home">
          <Button variant="secondary" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </Hint>
      <TabSeparator />
      <Hint label="Rename" side="bottom" sideOffset={10}>
        <Button
          variant="ghost"
          className="text-base font-normal px-2"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
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
      <div className="ml-auto flex w-full space-x-2 sm:justify-end">
        <FormViewer formId={formId} />
        <Hint label="Make publicly accessible" side="bottom" sideOffset={10}>
          <Button>Publish</Button>
        </Hint>
      </div>
    </div>
  );
};
