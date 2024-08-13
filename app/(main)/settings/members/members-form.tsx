"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as z from "zod";

import { LoaderCircle, MoreHorizontal } from "lucide-react";

import { MemberActions } from "@/components/member-actions";

import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TabsTrigger, TabsList, Tabs, TabsContent } from "@/components/ui/tabs";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { useOrganization } from "@/hooks/use-organization";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["member", "admin"], {
    required_error: "You need to select a role",
  }),
});

export const MembersForm = () => {
  const { organization } = useOrganization();

  const [isLoading, setIsLoading] = useState(false);

  const pending = useQuery(
    api.invitations.get,
    organization?._id ? { orgId: organization._id } : "skip"
  );
  const existing = useQuery(
    api.members.get,
    organization?._id ? { orgId: organization._id } : "skip"
  );

  const { mutate: sendInvite } = useApiMutation(api.invitations.send);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organization) {
      return;
    }

    setIsLoading(true);

    try {
      await sendInvite({
        email: values.email,
        orgId: organization._id!,
        role: values.role,
      });

      toast.success("Invitation sent");
      form.reset();
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Members</CardTitle>
          <CardDescription>
            Invite new members to your organization by email.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage className="absolute text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="w-[180px]">
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="absolute text-xs mt-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-2 bg-muted/50 justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Invite
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Tabs defaultValue="existing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="existing">Members</TabsTrigger>
          <TabsTrigger value="pending">Pending invitations</TabsTrigger>
        </TabsList>
        <TabsContent value="existing" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {existing?.map((member) => (
                <TableRow key={member._id}>
                  <TableCell className="font-medium truncate">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {member.role}
                  </TableCell>
                  <TableCell className="text-right">
                    <MemberActions id={member._id} type="member">
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </MemberActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending?.map((invite) => (
                <TableRow key={invite._id}>
                  <TableCell className="font-medium truncate">{invite.email}</TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {invite.role}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {invite.status}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(invite._creationTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <MemberActions id={invite._id} type="invitation">
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </MemberActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};
