"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useSession, signOut } from "next-auth/react";

import Image from "next/image";

import { Upload, LoaderCircle, ImagePlus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["owner", "admin", "member"], {
    required_error: "You need to select a role",
  }),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export const ProfileForm = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [userRole, setUserRole] = useState<"owner" | "admin" | "member" | null>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const { mutate: getImageUrl } = useApiMutation(api.files.getImageUrl);
  const { mutate: saveImageUrl } = useApiMutation(api.users.avatar);
  const { mutate: updateUser } = useApiMutation(api.users.profile);
  const { mutate: updatePassword } = useApiMutation(api.users.password);
  const { mutate: deleteUser } = useApiMutation(api.users.remove);

  const user = useQuery(api.users.get, { id: session?.user?.id as Id<"users"> });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: (user?.role as "owner" | "admin" | "member") || "undefined",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && session?.user?.id) {
      setIsUploading(true);
      const promise = (async () => {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();
        const url = await getImageUrl({ storageId });
        setAvatarUrl(url);
        await saveImageUrl({ userId: session?.user?.id ?? "", imageUrl: url });
      })();

      toast.promise(promise, {
        loading: "Uploading...",
        success: "Image uploaded",
        error: "Failed to upload image",
      });

      promise.finally(() => setIsUploading(false));
    }
  };

  const onSubmitProfile = async (values: ProfileFormValues) => {
    if (!session?.user?.id) {
      return;
    }

    setIsSubmittingProfile(true);
    const promise = updateUser({
      id: session.user.id,
      name: values.name,
      email: values.email,
      role: values.role !== "owner" ? values.role : undefined,
    });

    toast.promise(promise, {
      loading: "Updating...",
      success: "Profile updated",
      error: "Failed to update profile",
    });

    await promise;
    setIsSubmittingProfile(false);
  };

  const onSubmitPassword = async (values: PasswordFormValues) => {
    if (!session?.user?.id) {
      toast.error("User session not found");
      return;
    }

    setIsSubmittingPassword(true);
    const promise = updatePassword({
      userId: session.user.id,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    }).then(() => {
      passwordForm.reset();
    });

    toast.promise(promise, {
      loading: "Updating...",
      success: "Password updated",
      error: "Failed to update password",
    });

    await promise;
    setIsSubmittingPassword(false);
  };

  const handleDeleteUser = async () => {
    if (!session?.user?.id) {
      toast.error("User session not found");
      return;
    }

    const promise = deleteUser({ id: session.user.id }).then(() => {
      signOut({ callbackUrl: "/" });
      router.push("/");
    });

    toast.promise(promise, {
      loading: "Deleting...",
      success: "Profile deleted",
      error: "Failed to delete profile",
    });
  };

  useEffect(() => {
    if (user) {
      const role = user.role as "owner" | "admin" | "member";
      setUserRole(role);
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        role: role,
      });
      setAvatarUrl(user.image || null);
    }
  }, [user, profileForm]);

  return (
    <div className="space-y-8">
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Profile</CardTitle>
              <CardDescription>
                Manage your personal information and role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="col-span-full flex items-center gap-x-8 mb-6">
                <div
                  className={cn(
                    "w-24 h-24 flex items-center justify-center flex-none rounded-lg overflow-hidden",
                    avatarUrl ? "bg-transparent" : "bg-muted/40 border-2 border-dashed"
                  )}
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-24 w-24 object-cover"
                      width={96}
                      height={96}
                      priority
                    />
                  ) : (
                    <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("avatar-input")?.click()}
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
                    id="avatar-input"
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
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" autoComplete="name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile and in
                      emails.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the email that will be displayed on your profile and in
                      emails.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="member-role">Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={userRole === "owner"}
                    >
                      <FormControl>
                        <SelectTrigger id="member-role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <FormDescription>
                        This is your role in the organization.
                      </FormDescription>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-2 bg-muted/50 justify-end">
              <Button type="submit" disabled={isSubmittingProfile}>
                {isSubmittingProfile ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Password</CardTitle>
              <CardDescription>Change the password of your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-2 bg-muted/50 justify-end">
              <Button type="submit" disabled={isSubmittingPassword}>
                {isSubmittingPassword ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive text-lg font-medium">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and remove access to the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="border-t px-6 py-2 bg-muted/50">
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete profile</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive" onClick={handleDeleteUser}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
