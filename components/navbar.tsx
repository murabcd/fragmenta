"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import { MobileSidebar } from "./mobile-sidebar";
import { ModeToggle } from "./theme-toggle-mode";
import { InviteButton } from "./invite-button";
import { UserNav } from "./user-nav";

export const Navbar = () => {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="sticky top-0 z-20 w-full flex items-center justify-between py-2 px-4 h-16 bg-transparent backdrop-blur supports-[backdrop-filter]:bg-transparent">
      <div className="flex items-center">
        <MobileSidebar />
        <div className="text-2xl font-medium capitalize ml-4 md:ml-2">{segment}</div>
      </div>
      <div className="flex items-center gap-x-3">
        <InviteButton />
        <ModeToggle />
        <UserNav />
      </div>
    </div>
  );
};
