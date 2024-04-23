"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import { MobileSidebar } from "./mobile-sidebar";
import { dark } from "@clerk/themes";

import { useTheme } from "next-themes";

import { ModeToggle } from "./theme-toggle-mode";
import { InviteButton } from "./invite-button";

import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { theme } = useTheme();
  const segment = useSelectedLayoutSegment();

  return (
    <div className="w-full flex items-center justify-between py-2 px-4 h-16">
      <div className="flex items-center">
        <MobileSidebar />
        <div className="text-xl font-medium capitalize ml-4 md:ml-0">
          {segment}
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <InviteButton />
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
