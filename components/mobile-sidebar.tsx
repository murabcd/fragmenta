"use client";

import { PanelLeftOpen } from "lucide-react";

import Sidebar from "./sidebar";
import SidebarLogo from "./sidebar-logo";
import SidebarOrg from "./sidebar-org";
import OrgSwitcher from "./org";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon">
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 pt-10 w-64">
        <SidebarLogo />
        <OrgSwitcher />
        <Sidebar />
        <SidebarOrg />
      </SheetContent>
    </Sheet>
  );
};
