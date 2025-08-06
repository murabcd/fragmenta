import { Loader } from "lucide-react";
import React from "react";

export default function Loading() {
	return (
		<main className="h-full w-full relative touch-none flex items-center justify-center">
			<Loader className="h-6 w-6 text-muted-foreground animate-spin duration-700" />
		</main>
	);
}
