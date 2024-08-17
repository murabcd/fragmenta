"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import Image from "next/image";

import { ImagePlus, Upload, LoaderCircle } from "lucide-react";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
});

interface UserOrgProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserOrg = ({ isOpen, onOpenChange }: UserOrgProps) => {
  const { mutate: createOrg } = useApiMutation(api.organizations.create);
  const { mutate: getImageUrl } = useApiMutation(api.files.getImageUrl);
  const { mutate: saveImageUrl } = useApiMutation(api.files.saveImageUrl);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
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
    setIsSubmitting(true);
    const promise = (async () => {
      const orgId = await createOrg({
        name: values.name.trim(),
        slug: values.slug.trim(),
        imageUrl: imageUrl || undefined,
      });
      if (imageUrl) {
        await saveImageUrl({ orgId, imageUrl });
      }
      form.reset();
      setImageUrl(null);
      onOpenChange(false);
    })();

    toast.promise(promise, {
      loading: "Creating...",
      success: "Organization created",
      error: "Failed to create organization",
    });

    try {
      await promise;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const promise = (async () => {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        const url = await getImageUrl({ storageId: storageId as Id<"_storage"> });
        setImageUrl(url);
      })();

      toast.promise(promise, {
        loading: "Uploading...",
        success: "Image uploaded",
        error: "Failed to upload image",
      });

      try {
        await promise;
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>Create a new organization to get started.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormLabel htmlFor="org-image">Image</FormLabel>
              <div className="mt-1 flex items-center space-x-4">
                <div
                  className={cn(
                    "w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg",
                    imageUrl ? "bg-transparent" : "bg-muted/40 border-2 border-dashed"
                  )}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Image"
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover"
                    />
                  ) : (
                    <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Recommend size 1:1, JPEG or PNG, up to 5MB.
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="org-name">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your organization name"
                      {...field}
                      autoComplete="organization-name"
                      autoFocus
                      onChange={(e) => {
                        field.onChange(e);
                        const slug = generateSlug(e.target.value);
                        form.setValue("slug", slug);
                      }}
                    />
                  </FormControl>
                  <FormDescription>The name of your organization.</FormDescription>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="org-slug">Slug URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="organization-slug"
                      autoComplete="organization-slug"
                      onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    The slug of your organization. Must be unique.
                  </FormDescription>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
