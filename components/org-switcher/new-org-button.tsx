"use client";

import { Plus } from "lucide-react";

import { CreateOrganization } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { useTheme } from "next-themes";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const NewOrgButton = () => {
  const { theme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center p-2 cursor-pointer text-sm text-muted-foreground font-basic hover:bg-secondary ">
          <Plus className="mr-2 w-4 h-4" />
          New organization
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[350px] md:max-w-[430px]">
        <CreateOrganization
          routing="virtual"
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
