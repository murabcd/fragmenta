"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { LoaderCircle } from "lucide-react";
import { Icons } from "@/components/icons";

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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  path: z.string().url({ message: "Invalid URL" }),
});

interface IntegrationFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const GoogleSheets = ({ className, ...props }: IntegrationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      path: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Here you would typically call an API to connect to Google Sheets
      // For now, we'll just simulate a successful connection
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsConnected(true);
      toast.success("Connected");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to connect");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast.success("Disconnected");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Icons.googlesheets className="h-10 w-10" />
        <div>
          <CardTitle className="text-lg font-medium">Google Sheets</CardTitle>
          <CardDescription>
            Send your data straight to Google Sheets and sync all results as they come in.
          </CardDescription>
        </div>
      </CardHeader>
      <CardFooter className="border-t px-6 py-2 bg-muted/50 justify-end">
        {!isConnected ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Connect</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect to Google Sheets</DialogTitle>
                <DialogDescription>
                  Enter your Google email and the path to your sheet.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Your email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the Google account email you want to use.
                        </FormDescription>
                        <FormMessage className="text-xs text-destructive" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="path"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="path">Path URL</FormLabel>
                        <FormControl>
                          <Input
                            id="path"
                            type="url"
                            placeholder="e.g., https://docs.google.com/spreadsheets/d/..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of your Google Sheet.
                        </FormDescription>
                        <FormMessage className="text-xs text-destructive" />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Connect
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Disconnect</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will remove the connection to Google
                  Sheets and stop syncing your results.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button variant="destructive" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};
