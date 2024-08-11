"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import Image from "next/image";

import { Plus, ImagePlus, Upload, LoaderCircle } from "lucide-react";

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
  DialogTrigger,
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

export const UserOrg = () => {
  const { mutate: createOrg } = useApiMutation(api.organizations.create);
  const { mutate: getImageUrl } = useApiMutation(api.files.getImageUrl);
  const { mutate: saveImageUrl } = useApiMutation(api.files.saveImageUrl);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
    try {
      const orgId = await createOrg({
        name: values.name.trim(),
        slug: values.slug.trim(),
        imageUrl: imageUrl || undefined,
      });
      if (imageUrl) {
        await saveImageUrl({ orgId, imageUrl });
      }
      toast.success("Organization created");
      form.reset();
      setImageUrl(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create organization");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        const url = await getImageUrl({ storageId: storageId as Id<"_storage"> });
        setImageUrl(url);
        toast.success("Logo uploaded");
      } catch (error) {
        toast.error("Failed to upload logo");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
          <DialogDescription>Create a new organization to get started.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <FormLabel htmlFor="org-logo">Logo</FormLabel>
              <div className="mt-1 flex items-center space-x-2">
                <div
                  className={cn(
                    "w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg",
                    imageUrl ? "bg-transparent" : "bg-muted/40 border-2 border-dashed"
                  )}
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Logo"
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover"
                    />
                  ) : (
                    <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
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
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Recommend size 1:1, JPEG or PNG, up to 5MB.
              </p>
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
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
