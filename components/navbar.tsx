"use client";

import { Plus } from "lucide-react";

import { MobileSidebar } from "./mobile-sidebar";
import { dark } from "@clerk/themes";

import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import { ModeToggle } from "./theme-toggle-mode";

import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full flex items-center justify-between py-2 px-4 border-b shadow-sm h-16">
      <div className="flex items-center">
        <MobileSidebar />
      </div>
      <div className="flex items-center gap-x-3">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create form
        </Button>
        <ModeToggle />
        <UserButton
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;
