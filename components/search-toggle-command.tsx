"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import { Search } from "lucide-react";

import { useSearch } from "@/hooks/use-search";

const SearchToggleCommand = () => {
  const search = useSearch();

  return (
    <div className="relative mt-5 px-3">
      <Button
        variant="outline"
        className={cn(
          "relative h-10 px-2 w-full flex items-center justify-between rounded-md hover:bg-transparent text-sm font-normal text-muted-foreground shadow-sm"
        )}
        onClick={() => search.onOpen()}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="flex-grow text-left">Search...</span>
        <kbd className="flex-none select-none items-center gap-1 rounded border bg-muted/50 px-1.5 font-mono text-[10px] font-medium opacity-100 flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </div>
  );
};

export default SearchToggleCommand;
