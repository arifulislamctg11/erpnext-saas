"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Check, ExternalLink, Edit } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  aboutYou: z.string().min(10, "About you must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  linkedin: z.string().min(1, "LinkedIn username is required"),
  medium: z.string().min(1, "Medium username is required"),
  github: z.string().optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface CompletionItem {
  id: string;
  label: string;
  completed: boolean;
}

export function ProfileSettings() {
  const [linkedinConnected, setLinkedinConnected] = useState(true);
  const [mediumConnected, setMediumConnected] = useState(true);
  const [githubConnected, setGithubConnected] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "Gabriele",
      lastName: "Persola",
      email: "hello@gpdesign.com",
      contactNumber: "🇺🇸 123 4567 890",
      aboutYou:
        "I am a creative UX/UI Designer who likes to delve into customer problems and solve them through careful analysis and designing accessible, engaging, and intuitive interfaces.",
      website: "www.gabrielepersola.design.com",
      linkedin: "GabrielePersola",
      medium: "GPersola",
      github: "",
    },
  });

  const completionItems: CompletionItem[] = [
    { id: "photo", label: "Upload a profile photo", completed: true },
    { id: "email", label: "Verify email address", completed: true },
    { id: "phone", label: "Add phone number", completed: true },
    { id: "bio", label: "Complete biography", completed: true },
    { id: "website", label: "Add your website", completed: true },
    { id: "github", label: "Link GitHub account", completed: githubConnected },
  ];

  const completedCount = completionItems.filter(
    (item) => item.completed
  ).length;
  const completionPercentage = Math.round(
    (completedCount / completionItems.length) * 100
  );

  const onSubmit = (data: ProfileFormData) => {
    console.log("Profile data:", data);
  };

  const handleConnectGithub = () => {
    setGithubConnected(true);
  };

  return (
    <div className="p-3 min-h-screen overflow-auto  mx-auto space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-muted-foreground">
                            First name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-muted/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-muted-foreground">
                            Last name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-muted/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email and Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-muted-foreground">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-muted/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-muted-foreground">
                            Contact number
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-muted/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* About You */}
                  <FormField
                    control={form.control}
                    name="aboutYou"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">
                          About you
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-muted/50 min-h-[100px] resize-none"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Website */}
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">
                          Website
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-muted/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* LinkedIn */}
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">
                          LinkedIn
                        </FormLabel>
                        <div className="flex items-center gap-3">
                          <FormControl>
                            <Input {...field} className="bg-muted/50 flex-1" />
                          </FormControl>
                          {linkedinConnected && (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Account Linked
                            </Badge>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Medium */}
                  <FormField
                    control={form.control}
                    name="medium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">
                          Medium
                        </FormLabel>
                        <div className="flex items-center gap-3">
                          <FormControl>
                            <Input {...field} className="bg-muted/50 flex-1" />
                          </FormControl>
                          {mediumConnected && (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Account Linked
                            </Badge>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* GitHub */}
                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-muted-foreground">
                          GitHub
                        </FormLabel>
                        <div className="flex items-center gap-3">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your GitHub URL"
                              className="bg-muted/50 flex-1"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleConnectGithub}
                            className="shrink-0 bg-transparent"
                          >
                            Connect GitHub
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end w-full mt-8 pt-6">
                  <Button
                    type="submit"
                    variant={"default"}
                    className="w-[200px] "
                  >
                    Save changes
                  </Button>
                  </div>

                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                Profile Completed
              </CardTitle>
              <div className="text-3xl font-bold text-emerald-600">
                {completionPercentage}%
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              {completionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.completed ? (
                      <>
                        <span className="text-xs text-emerald-600 font-medium">
                          Completed
                        </span>
                        <Check className="w-4 h-4 text-emerald-600" />
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-muted-foreground font-medium">
                          Uncompleted
                        </span>
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
