"use client";

import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../contexts/use-auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const formSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  currency: z.string().min(1, "Please select a country"),
  abbr: z.string().min(1, "Please select a country"),
  tax_id: z.string().min(1, "Please select a country"),
  domain: z.string().min(1, "Please select a country"),
  date_established: z.string().min(1, "Please select a country"),
  country: z.string().min(1, "Please select a country"),
});

type FormData = z.infer<typeof formSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      country: "",
      currency: "",
      abbr: "",
      tax_id: "",
      domain: "",
      date_established: "",
    },
  });

  const navigate = useNavigate();
  const { signupWithEmail } = useAuth();

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);

    if (values) {
      setIsLoading(false);
      console.log("submited", values);
      navigate("/Payments/id");
    }
    // Simulate API call
    console.log("submited", values);

    setSubmitError(null);
    try {
      const user = await signupWithEmail(values.email, values.password);
      console.log("Firebase user created:", user.uid);
      navigate("/home");
    } catch (error) {
      const message =
        (error as { message?: string })?.message || "Failed to create account";
      setSubmitError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl shadow-xl p-4">
        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Create your account
            </h1>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      defaultValue={field.value}
                    >
                      <FormControl className="w-[300px]">
                        <SelectTrigger className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CAD">
                          CAD - Canadian Dollar
                        </SelectItem>
                        <SelectItem value="AUD">
                          AUD - Australian Dollar
                        </SelectItem>
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
                      defaultValue={field.value}
                    >
                      <FormControl className="w-[300px]">
                        <SelectTrigger className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CAD">
                          CAD - Canadian Dollar
                        </SelectItem>
                        <SelectItem value="AUD">
                          AUD - Australian Dollar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-700 font-medium">
                        Password
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
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
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              {submitError && (
                <p className="text-red-600 text-sm mt-2">{submitError}</p>
              )}
            </form>
          </Form>

          {/* Sign in link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <a href="/login" className="text-black hover:underline font-medium">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
