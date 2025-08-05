import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { FormPreview } from "./form-preview";

import type { Id } from "@/convex/_generated/dataModel";

interface QuestionDrawerProps {
	formId: Id<"forms">;
}

export const QuestionDrawer = ({ formId }: QuestionDrawerProps) => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline" size="icon">
					<Settings className="h-4 w-4" />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Settings</DrawerTitle>
						<DrawerDescription>
							Customize and preview your form questions.
						</DrawerDescription>
					</DrawerHeader>
					<div className="p-4 pb-0">
						<div className="flex flex-col items-center justify-center space-y-2">
							<FormPreview formId={formId} />
							<p className="text-sm text-muted-foreground">Preview</p>
						</div>
					</div>
					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant="ghost">Close</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
