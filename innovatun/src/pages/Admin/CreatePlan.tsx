"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent} from "../../components/ui/card";
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
import { api } from "../../api";
import { useAuth } from "../../contexts/use-auth";
import { useLocation, useNavigate } from "react-router-dom";
import { CreatePlanURL, GetPlansURL, UpdatePlansURL } from "../../api/Urls";
import { toast } from "sonner";

const formSchema = z.object({
  planName: z.string().min(3, "Plan name must be at least 3 characters"),
  planPrice: z.string().min(1, "Price must be at least 1 characters"),
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
  const navigate = useNavigate()
  const location = useLocation();
  const state = location.state;
  const [isLoading, setIsLoading] = useState(false);
  
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ProfileFormData | any>({
    resolver: zodResolver(formSchema),
    
  });

  const onSubmit = async (data: ProfileFormData | any) => {
    setIsLoading(true);
    setSubmitError(null);
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
      if(state?.id){
          const response = await fetch(`${api.baseUrl}${UpdatePlansURL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({...reqBody, _id: state?.id}),
          });
          const formatedRes = await response.json();
          if(formatedRes?.message == 'updated successfully!'){
            setIsLoading(false)
                toast.success("Plan updated Successfully", {
                description: 'Plan updated Successfully'
              });
            setTimeout(() => {
              navigate('/admin/settings')
            }, 1000)
          }else{
            setIsLoading(false)
            setSubmitError('Failed to create')
          }
      }else{
          const response = await fetch(`${api.baseUrl}${CreatePlanURL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(reqBody),
        });
        const formatedRes = await response.json();
        if(formatedRes?.message == 'Plan Created Successfully'){
          setIsLoading(false)
            toast.success("Plan Created Successfully", {
              description: 'Plan Created Successfully'
            });
        setTimeout(() => {
          navigate('/admin/settings')
        }, 1000)
        }else{
          setIsLoading(false)
          setSubmitError('Failed to create')
        }
      }
     
    } catch (error) {
       setIsLoading(true);
      setSubmitError(null);
    }
  };

  const fetchPlan = async () => {
       const response = await fetch(`${api.baseUrl}${GetPlansURL}/${state?.id}`, {
         method: "GET",
         headers: { "Content-Type": "application/json" },
         credentials: "include",
       });
       const formatedRes = await response.json();
       const formatObj = {
        ...formatedRes?.data,
          featureOne: formatedRes?.data?.features[0],
          feature2: formatedRes?.data?.features[1],
          feature3: formatedRes?.data?.features[2],
          feature4: formatedRes?.data?.features[3],
          feature5: formatedRes?.data?.features[4],
          feature6: formatedRes?.data?.features[5],
          feature7: formatedRes?.data?.features[6],
          feature8: formatedRes?.data?.features[7],
          feature9: formatedRes?.data?.features[8],
          feature10: formatedRes?.data?.features[9],
       }
       form.reset(formatObj);
  }

  useEffect(() => {
    if(state?.id){
      fetchPlan()
    }
  },[state?.id])

  return (
    <div className="p-3 min-h-screen overflow-auto bg-white mx-auto space-y-3">
       <div className="w-full md:max-w-5xl mx-auto">
          <Card>
        <p className="font-bold text-lg md:text-3xl my-3"> Plan</p>
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
