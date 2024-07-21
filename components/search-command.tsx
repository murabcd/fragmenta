"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useQuery } from "convex/react";

import { useSearch } from "@/hooks/use-search";

import { api } from "@/convex/_generated/api";

import { Circle } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const SearchCommand = () => {
  const router = useRouter();
  const data = useQuery(api.forms.search);
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/form/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {data && data.length > 0 && (
          <CommandGroup heading="Forms">
            {data.map((form) => (
              <CommandItem
                key={form._id}
                id={form._id}
                title={form.title}
                value={`${form._id}-${form.title}`}
                onSelect={() => onSelect(form._id)}
              >
                <Circle className="mr-2 h-4 w-4" />
                <span>{form.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
