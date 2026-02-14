"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { ChevronDown, Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { Doc } from "@/convex/_generated/dataModel";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface TypeSelectorProps {
	question: Doc<"questions">;
	type: string;
	onTypeChange: (id: string, newType: string) => void;
	className?: string;
}

export const TypeSelector = ({
	question,
	type,
	onTypeChange,
	className,
}: TypeSelectorProps) => {
	const handleTypeSelect = (type: string) => {
		onTypeChange(question._id, type);
	};

	const screenTypes = ["Start screen", "End screen"];
	const questionTypes = [
		"Short text",
		"Long text",
		"Yes/no choice",
		"Single choice",
		"Multiple choice",
		"Rating",
	];

	return (
		<div className="grid gap-2">
			<Label htmlFor="type-selector">Type</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="type-selector"
						variant="outline"
						role="combobox"
						aria-label="Select a type"
						className={cn(
							"mx-auto w-[230px] p-3 justify-between shadow-sm font-normal text-muted-foreground hover:bg-transparent",
							className,
						)}
					>
						{type}
						<ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-[230px] p-0">
					<Command loop>
						<CommandList className="max-h-[400px]">
							<CommandInput placeholder="Search by type..." />
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup heading="Questions">
								{questionTypes.map((typeItem) => (
									<CommandItem
										key={typeItem}
										onSelect={() => handleTypeSelect(typeItem)}
										className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
									>
										{typeItem}
										{typeItem === type && (
											<Check className="ml-auto h-3 w-3 opacity-50" />
										)}
									</CommandItem>
								))}
							</CommandGroup>
							<CommandGroup heading="Screens">
								{screenTypes.map((typeItem) => (
									<CommandItem
										key={typeItem}
										onSelect={() => handleTypeSelect(typeItem)}
										className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
									>
										{typeItem}
										{typeItem === type && (
											<Check className="ml-auto h-3 w-3 opacity-50" />
										)}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
};
