

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../contexts/use-auth";
import { api } from "../../../api";
import { toast } from "sonner";

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
import { GetHomePlansURL, InfoCheckURL } from "../../../api/Urls";

const formSchema = z
  .object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    currency: z.string().min(1, "Please select a currency"),
    abbr: z.string().min(1, "Please enter abbreviation"),
    tax_id: z.string().min(1, "Please enter tax ID"),
    domain: z.string().min(1, "Please enter domain"),
    date_established: z.string().min(1, "Please enter date of establishment"),
    date_of_birth: z.string().min(1, "Please enter date of Birth"),
    date_of_joining: z.string().min(1, "Please enter date of Joining"),
    gender: z.string().min(1, "Please enter gender"),
    country: z.string().min(1, "Please select a country"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  });

type FormData = z.infer<typeof formSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [cmpyErr, SetCmpyErr] = useState('');
  const [abbrErr, SetAbbrErr] = useState('');
  const [emailErr, SetEmailErr] = useState('');
  const [userNameErr, SetUserNameErr] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countries, setCountries] = useState([])
  const [showPassword, setShowPassword] = useState(false);
  const [currencies, setCurrencies] = useState([])
  
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
      confirmPassword: "",
      date_of_birth: "",
      date_of_joining: "",
      gender: ""
    },
  });

  const navigate = useNavigate();
  const location = useLocation();
  const {isAdmin, user, signupWithEmail } = useAuth();
  const [plansData, setPlansData]: any = useState([]);
  
  // Get the plan selected before redirecting
  const selectedPlanId = location.state?.priceId as string | undefined;

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    setSubmitError(null);
    if(cmpyErr || emailErr || abbrErr || userNameErr){
      setIsLoading(false)
      setSubmitError('')
      return
    }
    try {
      // Register user in MongoDB backend
      const response = await fetch(`${api.baseUrl}${api.register}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({...values}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

       await response.json();

      // Create Firebase user
       await signupWithEmail(values.email, values.password);

      toast.success("Account created successfully!", {
        description: "Welcome to ERPNext SaaS!",
      });
     
      // If a plan was selected before registration, redirect to Stripe checkout
      if (selectedPlanId) {
        const selectedPlan = plansData.find((p: any) => p?.price?.id === selectedPlanId);
        localStorage.setItem('innovatunplan', JSON.stringify(selectedPlan))
        if (selectedPlan) {
          try {
            const res = await fetch(
              `${api.baseUrl}${api.createCheckoutSession}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  priceId: selectedPlanId,
                  customerEmail: values.email,
                  planName: selectedPlan.name,
                  planAmount: selectedPlan.price?.unit_amount,
                  successUrl: `${
                    window.location.origin
                  }/success?session_id={CHECKOUT_SESSION_ID}&plan_name=${encodeURIComponent(
                    selectedPlan.name
                  )}&plan_amount=${encodeURIComponent(selectedPlan.price?.unit_amount)}`,
                  cancelUrl: `${window.location.origin}/cancel`,
                }),
              }
            );

            const checkoutData = await res.json();

            if (checkoutData?.url) {
              window.location.href = checkoutData.url; // redirect to Stripe
              return;
            } else {
              toast.error("Checkout failed. Please try again.");
            }
          } catch (err) {
            console.error("Checkout error:", err);
            toast.error("Checkout failed. Please try again.");
          }
        }
      }

      // Default redirect if no plan selected
      navigate("/home");
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          const message =
            "Unable to connect to registration server. Please check your internet connection and try again.";
          setSubmitError(message);
          toast.error("Network Error", { description: message });
        } else {
          const message = error.message || "Failed to create account";
          setSubmitError(message);
          toast.error("Registration failed", { description: message });
        }
      } else {
        const message = "Failed to create account";
        setSubmitError(message);
        toast.error("Registration failed", { description: message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const featchPlans = async () => {
    try {
        const response = await fetch(`${api.baseUrl}${GetHomePlansURL}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });
        const formatedRes = await response.json();
        console.log(formatedRes.products)
        if(formatedRes.products){
          setPlansData(formatedRes?.products)
        }
    } catch (error) {
      console.log('plan fetch err ===>', error)
    }
  }

  const getCountry = async () => {
      const response = await fetch(`${api.baseUrl}/country`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const formatedRes = await response.json();
      console.log(formatedRes)
      const formatOp = formatedRes?.data?.data?.map((item: any) => {
        const newObj = {label: item?.name, value: item?.name}
        return newObj
      });

      const formatCurrOp = formatedRes?.courrency?.data?.map((item: any) => {
        const newObj = {label: item?.name, value: item?.name}
        return newObj
      });
      console.log("formatOp ===>", formatCurrOp);
      setCurrencies(formatCurrOp)
      setCountries(formatOp)
  }
  useEffect(() => {
    featchPlans();
    getCountry()
  },[]);

  const onBlurHandler = async (fieldName: any, value: any) => {
   
    let reqBody = null;
    if(fieldName == 'companyName' && value){
      reqBody = {
        name: "name",
        value: value
      }
    }
    if(fieldName == 'abbr' && value){
      reqBody = {
        name: "abbr",
        value: value
      }
    }
    if(fieldName == 'email' && value){
      reqBody = {
        name: "email",
        value: value
      }
    }
    if(fieldName == 'username' && value){
      reqBody = {
        name: "username",
        value: value
      }
    }
   
    if(reqBody){
        setInfoLoading(true)
        const response = await fetch(`${api.baseUrl}${InfoCheckURL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      const formatedRes = await response.json();

      if(reqBody?.name == 'name'){
        setInfoLoading(false)
        if(formatedRes?.userCmpyInfo?.data?.length > 0){
          SetCmpyErr('Company Already Exists')
          return;
        }else{
          SetCmpyErr('')
           return;
        }
        
      }
      if(reqBody?.name == 'abbr'){
        setInfoLoading(false)
          if(formatedRes?.userCmpyInfo?.data?.length > 0){
            SetAbbrErr('Abbreviation Already Exists')
            return;
          }else{
            SetAbbrErr('')
            return;
          }
          
        }
      if(reqBody?.name == 'email'){
        setInfoLoading(false)
        if(formatedRes?.userCmpyInfo?.data?.length > 0){
          SetEmailErr('Email Already Exists')
          return;
        }else{
          SetEmailErr('')
           return;
        }
        
      }
      if(reqBody?.name == 'username'){
        setInfoLoading(false)
        if(formatedRes?.userCmpyInfo?.data?.length > 0){
          SetUserNameErr('UserName Already Exists')
          return;
        }else{
          SetUserNameErr('')
           return;
        }
        
      }
    }
  }

  useEffect(() => {
    if(user?.email){
      if(isAdmin){
          navigate('/admin')
      }else{
        navigate('/dashboard')
      }
   
    }
  },[user?.email])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl shadow-xl p-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
          </div>
        <Form {...form}>
            <form
              onSubmit={(e) => form.handleSubmit(onSubmit)(e)}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                      Employee/User Details
                    </h1>
                  </div>
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    {/* Username, Email */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="johndoe"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                              onBlur={(e) => onBlurHandler(e.target.name, e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  {userNameErr && (
                      <p className="text-red-600 text-sm mt-2">{userNameErr}</p>
                    )}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="m@example.com"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                              onBlur={(e) => onBlurHandler(e.target.name, e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  {emailErr && (
                      <p className="text-red-600 text-sm mt-2">{emailErr}</p>
                    )}

                    <FormField
                      control={form.control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Date of Birth
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="YYYY-MM-DD"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                              type="date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date_of_joining"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Date of Joining
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="YYYY-MM-DD"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                              type="date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="sm:w-[300px] w-full">
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Gender
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="sm:w-[300px] w-full">
                              <SelectTrigger className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white w-[250px] sm:w-[300px]">
                               <SelectItem value="male">
                                  Male
                                </SelectItem>
                                
                                <SelectItem value="female">
                                  Female
                                </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium mt-2">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0 pr-16"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-800"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium mt-2">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showConfirm ? "text" : "password"}
                                  className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0 pr-16"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirm((p) => !p)}
                                  className="absolute inset-y-0 right-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-800"
                                >
                                  {showConfirm ? "Hide" : "Show"}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                      Company Details
                    </h1>
                  </div>

                    {/* Company Name */}
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
                              onBlur={(e) => onBlurHandler(e.target.name, e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  {cmpyErr && (
                      <p className="text-red-600 text-sm mt-2">{cmpyErr}</p>
                    )}

                    {/* Abbr, Tax ID, Domain, Date Established */}
                    <FormField
                      control={form.control}
                      name="abbr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Abbr
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter abbreviation"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                              onBlur={(e) => onBlurHandler(e.target.name, e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {abbrErr && (
                      <p className="text-red-600 text-sm mt-2">{abbrErr}</p>
                    )}
                    <FormField
                      control={form.control}
                      name="tax_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Tax ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter tax ID"
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
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Domain
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="example.com"
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
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Date of Establishment
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="YYYY-MM-DD"
                              className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0"
                              {...field}
                              type="date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Currency */}
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="sm:w-[300px] w-full">
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Currency
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="sm:w-[300px] w-full">
                              <SelectTrigger className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white w-[250px] sm:w-[300px]">
                              {currencies?.map((item: any) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Country */}
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="sm:w-[300px] w-full ">
                          <FormLabel className="text-gray-700 font-medium mt-2">
                            Country
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="sm:w-[300px] w-full">
                              <SelectTrigger className="h-12 border-gray-300 focus:border-gray-400 focus:ring-0">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white w-[250px] sm:w-[300px]">
                              {countries?.map((item: any) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium mt-6"
                      disabled={isLoading || infoLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                    {submitError && (
                      <p className="text-red-600 text-sm mt-2">{submitError}</p>
                    )}

                {/* Sign in link */}
                <div className="text-center mt-6">
                  <span className="text-gray-600">Already have an account? </span>
                  <a href="/login" className="text-black hover:underline font-medium">
                    Sign in
                  </a>
                </div>
              </div>
            </form>
        </Form>
      </div>
    </div>
  );
}
