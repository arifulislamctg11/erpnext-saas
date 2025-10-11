import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../../components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../../../../components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover"
import { Calendar } from "../../../../../components/ui/calendar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "../../../../../lib/utils"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { baseUrl, CurrentPlanUrl, GetHomePlansURL, InfoCheckURL } from "../../../../../api/Urls"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "../../../../../api"
import { useAuth } from "../../../../../contexts/use-auth"
import { accessRoles, accountsModules } from "../../../../../lib/staticData"

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    required_error: "Please select a gender.",
  }),
  joiningDate: z.date({
    required_error: "Joining date is required.",
  }),
})

type Props = { setOpen: (open: boolean) => void, companyName: string, setRefetchEmployee: React.Dispatch<React.SetStateAction<boolean>> }

type FormValues = z.infer<typeof formSchema>
export default function TableFrom({ setOpen, companyName, setRefetchEmployee }: Props) {

  const [loading, setLoading] = useState(false)
  const [passErrorMgs, setPassErrorMgs] = useState('')
  const { user} = useAuth();
  const [currentPlanData, setCurrentPlanData] : any= useState(null);
  const [emailErr, SetEmailErr] = useState('');

  function getEnabledRoles(accessRoles: any, enabledModules: any) {
    const rolesSet = new Set();

    for (const module of accessRoles) {
      // Normalize keys: replace _ with space to match accessRoles ids
      const normalizedKey = module.id.replace(/\s+/g, "_");

      if (enabledModules[normalizedKey] === true) {
        module.roles.forEach((role: any) => rolesSet.add(role));
      }
    }

    return Array.from(rolesSet);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPassErrorMgs('');
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const newData: any = { ...data, companyName: companyName }
 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(newData.password as string)) {
      setPassErrorMgs("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      setLoading(false);
      return;
    }
    if(!currentPlanData?.access_roles ||!currentPlanData){
       toast.error("Before adding user, you have to subscribe plan");
      setLoading(false);
      return;

    }
    if(emailErr){
      setLoading(false);
      return;
    }
    try {

        const plan_roles = currentPlanData?.access_roles;
        
        const rolesArray = getEnabledRoles(accessRoles, plan_roles);
        const uniqueArray = [...new Set(rolesArray)];
        const formatRoles = uniqueArray?.map((item: any) => {
          const newObj = {role: item};
          return newObj
        });
        
        const blockRoles = []
        for (const item of accountsModules) {
          if(!plan_roles[item.name]){
                const neObj = {module: item?.label}
                blockRoles.push(neObj)
            }
        }
        
        const roleReqBody = {
          roles: formatRoles,
          email: newData?.email,
          blockRoles
        }
      const res = await axios.post(`${baseUrl}/create-user-and-employee`, newData);

      const res_roles = await fetch(`${api.baseUrl}/set-role`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(roleReqBody),
          });
      if (res.data.success) {
        setRefetchEmployee(prev => !prev)
        toast.success("User and Employee created successfully");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const getCurrentPlan = async () => {
     setLoading(true);
    const response = await fetch(`${api.baseUrl}${CurrentPlanUrl}?email=${user?.email}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });
    const formatedRes = await response.json();

     const plan_response = await fetch(`${api.baseUrl}${GetHomePlansURL}`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                },
              });
    const formatedPlanRes = await plan_response.json();
    
    if(formatedRes?.data){
      const findPlan = formatedPlanRes?.products?.find((item : any) => item?.name == formatedRes?.data?.planName)
      setCurrentPlanData(findPlan);
       setLoading(false);

    }else{
      setCurrentPlanData(null)
       setLoading(false);
    }
  }
  
  useEffect(() => {
    if(user?.email){
      getCurrentPlan()
    }
  },[user?.email])


  const onBlurHandler = async (fieldName: any, value: any) => {
    
    let reqBody = null;
  
    if(fieldName == 'email' && value){
      reqBody = {
        name: "email",
        value: value
      }
    }
    
    if(reqBody){
        setLoading(true)
        const response = await fetch(`${api.baseUrl}${InfoCheckURL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      const formatedRes = await response.json();

      if(reqBody?.name == 'email'){
        setLoading(false)
        if(formatedRes?.userCmpyInfo?.data?.length > 0){
          SetEmailErr('Email Already Exists')
          return;
        }else{
          SetEmailErr('')
            return;
        }
      }
    }
  }
  
  return (
    <div>
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
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
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="joiningDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Joining Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form> */}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="">First Name</label>
            <Input type="text" placeholder="First Name" name="firstName" className="mb-4 mt-2" />
          </div>
          <div className="">
            <label htmlFor="">Last Name</label>
            <Input type="text" placeholder="Last Name" name="lastName" className="mb-4 mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="">Email</label>
            <Input onBlur={(e) => {
              onBlurHandler('email', e.target.value)
            }} type="email" placeholder="Email" name="email" className="mb-4" />
            {emailErr && (
                <p className="text-red-600 text-sm mt-2">{emailErr}</p>
              )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="">Password</label>
            <Input type="password" placeholder="Password" name="password" className="mb-4" />
            <span className="text-[10px] text-red-700">{passErrorMgs}</span>
          </div>
        </div>

        <div className="my-4">
          <label htmlFor="">Gender</label>
          <Select name="gender" >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your gander" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gander</SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>


        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-[15px] text-gray-600">Date of Birth</label>
            <Input type="date" placeholder="Date of Birth" name="dateOfBirth" className="mb-4" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-[15px] text-gray-600">Joining Date</label>
            <Input type="date" placeholder="Joining Date" name="joiningDate" className="mb-4" />
          </div>
        </div>

        <Input type="submit" value="Submit" className="bg-black text-white" disabled={loading} />
      </form>
    </div>
  )
}
