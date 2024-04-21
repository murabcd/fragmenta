"use client";

import { Input } from "./ui/input";

import { Search } from "lucide-react";

const SearchCommand = () => {
  return (
    <div className="relative mt-5 px-3">
      {/* <div className="relative hidden md:block mt-5 px-3"> */}
      <div className="relative mt-1 rounded-md shadow-sm">
        <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
        <Input
          type="text"
          name="search"
          id="search"
          placeholder="Search..."
          className="pl-10 bg-primary-foreground hover:bg-primary/10"
        />
      </div>
    </div>
  );
};

export default SearchCommand;
