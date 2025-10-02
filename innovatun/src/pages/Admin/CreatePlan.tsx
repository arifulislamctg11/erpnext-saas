"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Check, ExternalLink, Edit } from "lucide-react";
import { api } from "../../api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useAuth } from "../../contexts/use-auth";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  currency: z.string().min(1, "Please select a currency"),
  abbr: z.string().min(1, "Please enter abbreviation"),
  tax_id: z.string().min(1, "Please enter tax ID"),
  domain: z.string().min(1, "Please enter domain"),
  date_established: z.string().min(1, "Please enter date of establishment"),
  country: z.string().min(1, "Please select a country"),
});

type ProfileFormData = z.infer<typeof formSchema>;

export function Createplan() {
  const [isLoading, setIsLoading] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successTxt, setSuccessTxt] = useState('')
  const { user} = useAuth();
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
     
      
    } catch (error) {
      
    }
  };

  const fetchProfile = async () => {
   
  }

  useEffect(() => {
    if(user?.email){
      fetchProfile()
    }
  },[user?.email])

  return (
    <div className="p-3 min-h-screen overflow-auto bg-white mx-auto space-y-3">
       <div className="">
          <Card>
                    <p className="font-bold text-lg md:text-3xl my-3">Create New Plan</p>
            <CardContent className="">
                {/* Form */}
                <Form {...form}>
                  <form onSubmit={(e) => {
                    console.log('Form submitted');
                    form.handleSubmit(onSubmit)(e);
                  }} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Acme Inc."
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              First Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                                {...field}
                              />
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
                            <FormLabel className="text-gray-700 font-medium">
                              Last Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="johndoe"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <Button
                      type="submit"
                      className="w-full md:w-[200px] h-12 bg-black hover:bg-gray-800 text-white font-medium mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                    {submitError && (
                      <p className="text-red-600 text-sm mt-2">{submitError}</p>
                    )}
                  </form>
                </Form>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
