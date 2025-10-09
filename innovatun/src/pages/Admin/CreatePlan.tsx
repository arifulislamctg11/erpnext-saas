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
import { Checkbox } from "../../components/ui/checkbox";
import { accountsModules } from "../../lib/staticData";

const formSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters"),
  price: z.string().min(1, "Price must be at least 1"),
  trialDays: z.string().optional(),
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
  Assets: z.boolean().optional(),
  Automation: z.boolean().optional(),
  Bulk_Transaction: z.boolean().optional(),
  Buying: z.boolean().optional(),
  Communication: z.boolean().optional(),
  Contacts: z.boolean().optional(),
  CRM: z.boolean().optional(),
  Custom: z.boolean().optional(),
  Email: z.boolean().optional(),
  ERPNext_Integrations: z.boolean().optional(),
  Geo: z.boolean().optional(),
  HR: z.boolean().optional(),
  Integrations: z.boolean().optional(),
  Maintenance: z.boolean().optional(),
  Manufacturing: z.boolean().optional(),
  Payroll: z.boolean().optional(),
  Portal: z.boolean().optional(),
  Printing: z.boolean().optional(),
  Projects: z.boolean().optional(),
  Quality_Management: z.boolean().optional(),
  Selling: z.boolean().optional(),
  Social: z.boolean().optional(),
  Stock: z.boolean().optional(),
  Subcontracting: z.boolean().optional(),
  Support: z.boolean().optional(),
  Accounts : z.boolean().optional()
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
    defaultValues: {
      Assets: false,
      Automation: false,
      Bulk_Transaction: false,
      Buying: false,
      Communication: false,
      Contacts: false,
      CRM: false,
      Custom: false,
      Email: false,
      ERPNext_Integrations: false,
      Geo: false,
      HR: false,
      Integrations: false,
      Maintenance: false,
      Manufacturing: false,
      Payroll: false,
      Portal: false,
      Printing: false,
      Projects: false,
      Quality_Management: false,
      Selling: false,
      Social: false,
      Stock: false,
      Subcontracting: false,
      Support: false,
      Accounts: false,
    }
  });

  const onSubmit = async (data: ProfileFormData | any) => {
    setIsLoading(true);
    setSubmitError(null);
    try {

     const featursData = [2,3,4,5,6,7,8,9,10].map((item: any) => {
        const itm = data[`feature${item}`]
        return itm
     })
     const access_roles: any = {};
     let count = 0;
     console.log('check ===>', data)
     for (const item of accountsModules) {
      if(data[item.name]){
           access_roles[item.name] = true;
           count += 1
        }else{
           access_roles[item.name] = false;
        }
     }
     if(count < 3){
      setIsLoading(false)
      setSubmitError('Select minimum three module permission')
      return
     }
     const reqBody = {
      name: data?.name,
      price: data?.price,
      trialDays: 14,
      features: [
        data?.featureOne,
        ...featursData
      ],
      access_roles
     }
   
      if(state?.id){
          const response = await fetch(`${api.baseUrl}${UpdatePlansURL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({...reqBody, id: state?.id}),
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
       console.log(formatedRes)
       const formatObj = {
        ...formatedRes?.data,
          price: `${formatedRes?.data?.price}`,
          featureOne: formatedRes?.data?.features[0] || '',
          feature2: formatedRes?.data?.features[1] || '',
          feature3: formatedRes?.data?.features[2] || '',
          feature4: formatedRes?.data?.features[3] || '',
          feature5: formatedRes?.data?.features[4] || '',
          feature6: formatedRes?.data?.features[5] || '',
          feature7: formatedRes?.data?.features[6] || '',
          feature8: formatedRes?.data?.features[7] || '',
          feature9: formatedRes?.data?.features[8] || '',
          feature10: formatedRes?.data?.features[9] || '',
          ...formatedRes?.data?.access_roles
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
                      name="name"
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
                      name="price"
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
                             value={14}
                            disabled={true}
                              placeholder="Trial Days"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
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
                  <p className="font-bold text-start">Module Permission:</p>
                  <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {
                    accountsModules?.map((item: any) => (
                      <FormField
                        control={form.control}
                        name={item?.name}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                id={item?.name}
                                disabled={state?.id ? true : false}
                              />
                            </FormControl>
                            <FormLabel htmlFor="acceptTerms" className="text-gray-700 font-medium">
                              {item?.label}
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))
                  }
                  </div>
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
