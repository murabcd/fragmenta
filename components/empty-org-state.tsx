"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Plus, PartyPopper } from "lucide-react";

import { CreateOrganization } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { useTheme } from "next-themes";

export const EmptyOrgState = () => {
  const { user } = useUser();
  const { theme } = useTheme();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <PartyPopper className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-semibold mt-6">
        Welcome, {user?.firstName}
      </h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create an organization to get started.
      </p>
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create organization
            </Button>
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
      </div>
    </div>
  );
};
