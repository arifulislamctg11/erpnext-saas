"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Check, ExternalLink, Edit } from "lucide-react";
import { api } from "../../api";
import { CompleteProfileURL, ProfileUrl, UpdateProfileURL } from "../../api/Urls";
import { useAuth } from "../../contexts/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { countries, currencies } from "../../lib/staticData";
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

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successTxt, setSuccessTxt] = useState('')
  const { user} = useAuth();
  const [completionItems, setCompletionItems]: any = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setSubmitError(null);
    try {
      const response = await fetch(`${api.baseUrl}${UpdateProfileURL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      });
      const formatedRes = await response.json();
      if(formatedRes?.message == 'updated successfully!'){
        setIsLoading(false)
        setSuccessTxt('Profile Updated Successfully !')
        setTimeout(() => setSuccessTxt(''), 3000)
      }else{
        setIsLoading(false)
        setSubmitError('Failed to update')
      }
    } catch (error) {
      
    }
  };

  const fetchProfile = async () => {
    const response = await fetch(`${api.baseUrl}${ProfileUrl}?email=${user?.email}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const formatedRes = await response.json();
    form.reset(formatedRes?.data);

    const profile_cmplt_res = await fetch(`${api.baseUrl}${CompleteProfileURL}?email=${user?.email}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

     const formatedCmpltRes = await profile_cmplt_res.json();
     if(formatedCmpltRes?.data?.email){
        setCompletionItems([
              { id: "photo", label: "Company Creation", completed: true },
              { id: "email", label: "User Creation", completed: true },
              { id: "phone", label: "Employee Creation", completed: true },
              { id: "bio", label: "Assignment", completed: true },
            ])
        setCompletionPercentage(100)
     }else{
          setCompletionItems([
          { id: "photo", label: "Company Creation", completed: false },
          { id: "email", label: "User Creation", completed: false },
          { id: "phone", label: "Employee Creation", completed: false },
          { id: "bio", label: "Assignment", completed: false },
        ])
     }
  }

  useEffect(() => {
    if(user?.email){
      fetchProfile()
    }
  },[user?.email])

  return (
    <div className="p-3 min-h-screen overflow-auto  mx-auto space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Form */}
        <div className="lg:col-span-2">
          <Card>
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

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={true}
                        type="email"
                        placeholder="m@example.com"
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
                name="abbr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Abbr
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder=" enter abbreviation "
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
                name="tax_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Tax ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="m@example.com"
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
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Domain
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="m@example.com"
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
                name="date_established"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Date of Establishment
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="m@example.com"
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
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-[300px]">
                    <FormLabel className="text-gray-700 font-medium">
                      Currency
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl className="w-[300px]">
                        <SelectTrigger className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {
                          currencies?.map((item: any) => (
                            <SelectItem value={item?.value}>{item?.label}</SelectItem>
                          )) 
                        }                       
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-[300px]">
                    <FormLabel className="text-gray-700 font-medium">
                      Country
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                       value={field.value}
                    >
                      <FormControl className="w-[300px]">
                        <SelectTrigger className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {
                          countries?.map((item: any) => (
                        <SelectItem value={item?.value}>{item?.label}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {
                successTxt ? <p className="text-green-500 font-semibold">{successTxt}</p> : <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
              }
              {submitError && (
                <p className="text-red-600 text-sm mt-2">{submitError}</p>
              )}
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
              {completionItems.map((item: any) => (
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
