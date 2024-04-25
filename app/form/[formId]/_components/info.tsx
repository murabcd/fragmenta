"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ChevronLeft, Eye, Menu } from "lucide-react";

import { Hint } from "@/components/hint";
import { FormActions } from "@/components/form-actions";

import { useRenameModal } from "@/hooks/use-rename-modal";

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

  if (!data) return <div>Loading...</div>;

  return (
    <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
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
          className="text-base font-normal px-2"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
      <TabSeparator />
      <FormActions
        id={data._id}
        title={data.title}
        side="bottom"
        sideOffset={10}
      >
        <div>
          <Hint label="Main menu" align="end" side="bottom" sideOffset={10}>
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </Hint>
        </div>
      </FormActions>
      <div className="ml-auto flex w-full space-x-2 sm:justify-end">
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <Button>Publish</Button>
      </div>
    </div>
  );
};
