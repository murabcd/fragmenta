"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Upload } from "lucide-react";

import { TypeSelector } from "@/components/forms/type-selector";
import { useFormEditor } from "@/hooks/use-form-editor";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import type { Doc } from "@/convex/_generated/dataModel";
import type { Id } from "@/convex/_generated/dataModel";

interface QuestionSettingsProps {
	question: Doc<"questions">;
	handleTypeChange?: (id: string, newType: string) => Promise<void>;
	handleRequiredChange?: (id: string, isRequired: boolean) => Promise<void>;
	onImageChange?: (id: string, imageUrl: string) => Promise<void>;
	onLayoutChange?: (
		id: string,
		layout: { mobile: string; desktop: string },
	) => Promise<void>;
}

export const QuestionSettings = ({
	question,
	handleTypeChange: toastHandleTypeChange,
	handleRequiredChange: toastHandleRequiredChange,
	onImageChange: toastOnImageChange,
	onLayoutChange: toastOnLayoutChange,
}: QuestionSettingsProps) => {
	const {
		newType,
		handleTypeChange: storeHandleTypeChange,
		handleRequiredChange: storeHandleRequiredChange,
		handleImageChange: storeHandleImageChange,
		handleLayoutChange: storeHandleLayoutChange,
		handleFocalPointChange: storeHandleFocalPointChange,
	} = useFormEditor();

	const generateUploadUrl = useMutation(api.files.generateUploadUrl);

	// Use toast handlers if provided, otherwise fall back to store handlers
	const handleTypeChange = toastHandleTypeChange || storeHandleTypeChange;
	const handleRequiredChange =
		toastHandleRequiredChange || storeHandleRequiredChange;
	const handleImageChange = toastOnImageChange || storeHandleImageChange;
	const handleLayoutChange = toastOnLayoutChange || storeHandleLayoutChange;
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleMobileLayoutChange = (value: string) => {
		handleLayoutChange(question._id, {
			mobile: value,
			desktop: question.imageLayout?.desktop || "left",
		});
	};

	const handleDesktopLayoutChange = (value: string) => {
		handleLayoutChange(question._id, {
			mobile: question.imageLayout?.mobile || "center",
			desktop: value,
		});
	};

	// Focal point state (percent based 0..100)
	const [focalPoint, setFocalPoint] = useState<
		{ x: number; y: number } | undefined
	>(question.imageFocalPoint);
	const handleFocalPointChange = toastOnLayoutChange
		? storeHandleFocalPointChange // keep consistent store method
		: storeHandleFocalPointChange;
	// Resolve image URL if it's a Convex storage id
	const resolvedImageUrl = useQuery(
		api.files.getQuestionImageUrl,
		question.image &&
			(question.image.startsWith("storage:") || question.image.length > 20)
			? { storageId: question.image as Id<"_storage"> }
			: "skip",
	);
	const previewUrl = useMemo(() => {
		if (!question.image) return "";
		if (
			question.image.startsWith("storage:") ||
			(question.image && question.image.length > 20)
		) {
			return resolvedImageUrl || "";
		}
		return question.image;
	}, [question.image, resolvedImageUrl]);
	const previewRef = useRef<HTMLDivElement | null>(null);

	const clamp = (val: number, min: number, max: number) =>
		Math.max(min, Math.min(max, val));

	const updateFromClientXY = (clientX: number, clientY: number) => {
		const el = previewRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
		const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
		setFocalPoint({ x, y });
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
		}
	};

	const handleUpload = async () => {
		if (selectedFile) {
			setIsUploading(true);
			try {
				// Get upload URL
				const uploadUrl = await generateUploadUrl();

				// Upload file to the URL
				const result = await fetch(uploadUrl, {
					method: "POST",
					headers: { "Content-Type": selectedFile.type },
					body: selectedFile,
				});

				// Get storage ID from response
				const { storageId } = await result.json();

				// Update the question with the storage ID
				handleImageChange(question._id, storageId);

				setSelectedFile(null);
				setIsDialogOpen(false);
			} catch (error) {
				console.error("Failed to upload image:", error);
			} finally {
				setIsUploading(false);
			}
		}
	};

	return (
		<div className="space-y-8 px-3 mt-5">
			<TypeSelector
				question={question}
				type={newType}
				onTypeChange={handleTypeChange}
			/>
			<div className="flex items-center justify-between">
				<Label htmlFor="required-mode">Required</Label>
				<Switch
					id="required-mode"
					aria-label="Required"
					checked={question.isRequired}
					onCheckedChange={(checked) =>
						handleRequiredChange(question._id, checked)
					}
				/>
			</div>
			<div className="flex items-center justify-between">
				<Label>Add image</Label>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button size="sm" variant="outline" className="h-8 w-8 p-0">
							<Plus className="h-4 w-4" />
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Upload Image</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="image-upload">Choose an image</Label>
								<Input
									id="image-upload"
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="cursor-pointer"
								/>
							</div>
							{selectedFile && (
								<div className="text-sm text-muted-foreground">
									Selected: {selectedFile.name}
								</div>
							)}
							<div className="flex justify-end space-x-2">
								<Button
									variant="outline"
									onClick={() => setIsDialogOpen(false)}
									disabled={isUploading}
								>
									Cancel
								</Button>
								<Button
									onClick={handleUpload}
									disabled={!selectedFile || isUploading}
									className="flex items-center space-x-2"
								>
									<Upload className="h-4 w-4" />
									<span>{isUploading ? "Uploading..." : "Upload"}</span>
								</Button>
							</div>
							{/* Focal point controls now live in the sidebar under layout */}
						</div>
					</DialogContent>
				</Dialog>
			</div>
			{/* Layout Section */}
			<div className="space-y-4">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Label>Mobile</Label>
						<Select
							value={question.imageLayout?.mobile || "center"}
							onValueChange={handleMobileLayoutChange}
						>
							<SelectTrigger className="w-24 h-8 bg-background">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="center">Center</SelectItem>
								<SelectItem value="top">Top</SelectItem>
								<SelectItem value="fill-top">Fill top</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center justify-between">
						<Label>Desktop</Label>
						<Select
							value={question.imageLayout?.desktop || "left"}
							onValueChange={handleDesktopLayoutChange}
						>
							<SelectTrigger className="w-24 h-8 bg-background">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="left">Left</SelectItem>
								<SelectItem value="right">Right</SelectItem>
								<SelectItem value="fill-left">Fill left</SelectItem>
								<SelectItem value="fill-right">Fill right</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
			{/* Focal point Section (visible when there's an image) */}
			{previewUrl && (
				<div className="space-y-3">
					<Label>Focal point</Label>
					<div className="flex items-start gap-3">
						<div
							ref={previewRef}
							className="relative w-48 h-32 overflow-hidden rounded-md border bg-muted select-none"
							onMouseDown={(e) => updateFromClientXY(e.clientX, e.clientY)}
							onMouseMove={(e) => {
								if (e.buttons !== 1) return;
								updateFromClientXY(e.clientX, e.clientY);
							}}
							onMouseUp={() => handleFocalPointChange(question._id, focalPoint)}
							onTouchStart={(e) => {
								const t = e.touches[0];
								updateFromClientXY(t.clientX, t.clientY);
							}}
							onTouchMove={(e) => {
								const t = e.touches[0];
								updateFromClientXY(t.clientX, t.clientY);
							}}
							onTouchEnd={() =>
								handleFocalPointChange(question._id, focalPoint)
							}
							role="application"
							aria-label="Adjust image focal point"
						>
							<Image
								src={previewUrl || ""}
								alt="Preview"
								fill
								className="object-cover"
							/>
							<div
								aria-hidden
								className="absolute w-4 h-4 -mt-2 -ml-2 rounded-full border-2 border-white bg-black/60"
								style={{
									left: `${focalPoint?.x ?? 50}%`,
									top: `${focalPoint?.y ?? 50}%`,
								}}
							/>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								setFocalPoint(undefined);
								handleFocalPointChange(question._id, undefined);
							}}
						>
							Reset
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
