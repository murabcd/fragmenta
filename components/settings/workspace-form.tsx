"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { LoaderCircle, Upload } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { useWorkspace } from "@/hooks/use-workspace";
import { Icons } from "@/components/icons";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Workspace name must be at least 2 characters.",
	}),
	slug: z.string().min(2, {
		message: "Slug must be at least 2 characters.",
	}),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export function WorkspaceForm() {
	const router = useRouter();
	const { workspace, setCurrentWorkspace } = useWorkspace();

	const { mutate: updateWorkspace } = useApiMutation(
		api.workspaces.updateWorkspace,
	);
	const { mutate: getImageUrl } = useApiMutation(api.files.getStorageUrl);
	const { mutate: saveImageUrl } = useApiMutation(
		api.files.updateWorkspaceImage,
	);
	const { mutate: deleteWorkspace } = useApiMutation(
		api.workspaces.deleteWorkspace,
	);

	const generateUploadUrl = useMutation(api.files.generateUploadUrl);

	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			slug: "",
		},
	});

	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (!workspace?._id) {
			return;
		}

		setIsSubmitting(true);
		const promise = (async () => {
			await updateWorkspace({
				id: workspace._id,
				name: values.name.trim(),
				slug: values.slug.trim(),
				imageUrl: imageUrl || undefined,
			});
			if (imageUrl) {
				await saveImageUrl({ wsId: workspace._id, imageUrl });
			}

			setCurrentWorkspace({
				...workspace,
				name: values.name.trim(),
				slug: values.slug.trim(),
				imageUrl: imageUrl || workspace.imageUrl,
			});
		})();

		toast.promise(promise, {
			loading: "Updating...",
			success: "Workspace updated",
			error: "Failed to update workspace",
		});

		try {
			await promise;
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file && workspace) {
			setIsUploading(true);
			const promise = (async () => {
				const uploadUrl = await generateUploadUrl();
				const result = await fetch(uploadUrl, {
					method: "POST",
					headers: { "Content-Type": file.type },
					body: file,
				});
				const { storageId } = await result.json();
				const url = await getImageUrl({
					storageId: storageId as Id<"_storage">,
				});
				setImageUrl(url);

				setCurrentWorkspace({
					...workspace,
					imageUrl: url,
				});
			})();

			toast.promise(promise, {
				loading: "Uploading...",
				success: "Image uploaded",
				error: "Failed to upload image",
			});

			promise.finally(() => setIsUploading(false));
		}
	};

	const handleDeleteWorkspace = async () => {
		if (!workspace?._id) {
			toast.error("No workspace found");
			return;
		}

		const promise = deleteWorkspace({ id: workspace._id }).then(() => {
			router.push("/");
		});

		toast.promise(promise, {
			loading: "Deleting...",
			success: "Workspace deleted",
			error: "Failed to delete workspace",
		});
	};

	useEffect(() => {
		if (workspace) {
			form.reset({
				name: workspace.name || "",
				slug: workspace.slug || "",
			});
			setImageUrl(workspace.imageUrl || null);
		}
	}, [workspace, form]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-medium">Workspace</CardTitle>
						<CardDescription>Manage your workspace settings.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="col-span-full flex items-center gap-x-8 mb-6">
							<div
								className={cn(
									"w-24 h-24 flex items-center justify-center flex-none rounded-lg overflow-hidden",
									imageUrl
										? "bg-transparent"
										: "bg-muted/40 border-2 border-dashed",
								)}
							>
								{imageUrl ? (
									<Image
										src={imageUrl}
										alt="Logo"
										className="h-24 w-24 object-cover"
									/>
								) : (
									<Icons.fragmenta className="w-12 h-12 text-muted-foreground" />
								)}
							</div>
							<div>
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										document.getElementById("file-upload")?.click()
									}
									disabled={isUploading}
								>
									{isUploading ? (
										<LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
									) : (
										<Upload className="w-4 h-4 mr-2" />
									)}
									Upload
								</Button>
								<input
									id="file-upload"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageUpload}
									disabled={isUploading}
								/>
								<p className="mt-1 text-xs text-muted-foreground">
									Recommend size 1:1, JPEG or PNG, up to 5MB.
								</p>
							</div>
						</div>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="workspace-name">Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Your workspace name"
											autoComplete="name"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												const slug = generateSlug(e.target.value);
												form.setValue("slug", slug);
											}}
										/>
									</FormControl>
									<FormDescription>
										This is the name that will be displayed on your profile.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="workspace-slug">Slug URL</FormLabel>
									<FormControl>
										<Input
											placeholder="workspace-slug"
											autoComplete="workspace-slug"
											{...field}
											onChange={(e) =>
												field.onChange(e.target.value.toLowerCase())
											}
										/>
									</FormControl>
									<FormDescription>
										The slug of your workspace must be unique.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className="border-t justify-end">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							Update
						</Button>
					</CardFooter>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-destructive text-lg font-medium">
							Danger Zone
						</CardTitle>
						<CardDescription>
							Permanently delete your workspace and remove access to all
							associated data.
						</CardDescription>
					</CardHeader>
					<CardContent className="border-t justify-end pt-6">
						<div className="flex justify-end">
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive">Delete workspace</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete
											your workspace and remove your data from our servers.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<Button
											variant="destructive"
											onClick={handleDeleteWorkspace}
										>
											Delete
										</Button>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
}
