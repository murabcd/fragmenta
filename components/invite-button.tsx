import { Plus } from "lucide-react";

import { OrganizationProfile } from "@clerk/nextjs";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { dark } from "@clerk/themes";

import { useTheme } from "next-themes";

export const InviteButton = () => {
  const { theme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Send invite
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-[350px] md:max-w-[880px]">
        <OrganizationProfile
          routing="virtual"
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
