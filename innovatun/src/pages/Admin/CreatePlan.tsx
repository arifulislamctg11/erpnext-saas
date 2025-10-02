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
import { useLocation } from "react-router-dom";

const formSchema = z.object({
  planName: z.string().min(3, "Plan name must be at least 3 characters"),
  planPrice: z.string().min(2, "Price must be at least 1 characters"),
  trialDays: z.string().min(2, "Trial Day must be at least 2 characters"),
  featureOne: z.string().min(10, "Feature description must be at least 10 character"),
  feature2: z.string().optional(),
  feature3: z.string().optional(),
  feature4: z.string().optional(),
  feature5: z.string().optional(),
  feature6: z.string().optional(),
  feature7: z.string().optional(),
  feature8: z.string().optional(),
  feature9: z.string().optional(),
  feature10: z.string().optional(),
});

type ProfileFormData = z.infer<typeof formSchema>;

export function Createplan() {
  const location = useLocation();
  const state = location.state;
  const [isLoading, setIsLoading] = useState(false);
  
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successTxt, setSuccessTxt] = useState('')
  const { user} = useAuth();
  const form = useForm<ProfileFormData | any>({
    resolver: zodResolver(formSchema),
    
  });

  const onSubmit = async (data: ProfileFormData | any) => {
    // setIsLoading(true);
    // setSubmitError(null);
    try {

     const featursData = [2,3,4,5,6,7,8,9,10].map((item: any) => {
        const itm = data[`feature${item}`]
        return itm
     })

     const reqBody = {
      planName: data?.planName,
      planPrice: data?.planPrice,
      trialDays: data?.trialDays,
      features: [
        data?.featureOne,
        ...featursData
      ]
     }
      console.log('reqBody ===>', reqBody)
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
       <div className="w-full md:max-w-5xl mx-auto">
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
                      name="planName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Plan Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Plan Name"
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
                      name="planPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Plan Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Plan Price"
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
                      name="trialDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Trial days
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Trial Days"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <p className="font-bold text-start">Features:</p>
                    <FormField
                      control={form.control}
                      name="featureOne"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Feature 1"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {
                      [2,3,4,5,6,7,8,9,10].map((item: any) => (
                        <FormField
                          control={form.control}
                          name={`feature${item}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={`Feature ${item}`}
                                  className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-start" />
                            </FormItem>
                          )}
                        />
                      ))
                    }

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
