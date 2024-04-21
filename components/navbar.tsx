"use client";

import { Plus } from "lucide-react";

import { MobileSidebar } from "./mobile-sidebar";

import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className="w-full flex items-center justify-between py-2 px-4 border-b h-16">
      <div className="flex items-center">
        <MobileSidebar />
      </div>
      <div className="flex items-center gap-x-3">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create form
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
