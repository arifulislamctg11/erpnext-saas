import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ArrowLeft, Mail, Phone, Calendar, CreditCard, FileText , CalendarDays, BookCheck, MapPin, Banknote, Eye, ShieldBan, ShieldCheck, Mars, Merge} from "lucide-react";
import { api } from "../../api";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails]: any = useState(null);

  const getUser = async () => {
      const response = await fetch(`${api.baseUrl}/single-user?email=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const formatedRes = await response.json();
      console.log(formatedRes?.data?.data);
      setUserDetails(formatedRes?.data?.data)
  }
  
  useEffect(() => {
    getUser()
  },[]);

    const [actionLoading, setActionLoading] = useState(false)

  const handleAction = async (status: any) => {
        setActionLoading(true)
          const response = await fetch(`${api.baseUrl}/user-enable-disable`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({status, employeeId: userDetails?.employee, isEmployee: true}),
        });
        const formatedRes = await response.json();
        getUser()
        setActionLoading(false)
        toast.success(`Employee Successfully ${status}`)
  }
  
  return (
    <div className="p-6">
      
      <div className="mb-8">
        <div className="flex flex-row justify-between items-center space-x-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
            <div className="flex flex-row">
               <Button variant='default'style={{marginRight: '10px'}} size="sm">
                  {userDetails?.status}
                </Button>
                {
                userDetails?.status == "Active" ? <Button disabled={actionLoading} onClick={() => handleAction('Inactive')} variant="outline" size="sm">
                  <ShieldBan className="h-4 w-4 mr-2" />
                  Disable
                </Button> : <Button disabled={actionLoading} onClick={() => handleAction('Active')} variant='outline' size="sm">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Enable
                </Button>
                }
            </div>
        </div>
      </div>
      {
        userDetails?.first_name ?  <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Basic user details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={userDetails?.first_name} />
                  <AvatarFallback>{(userDetails?.first_name).slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{userDetails?.employee_name}</div>
                  <div className="text-sm text-gray-500"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-start">Email</p>
                    <p className="text-sm text-gray-600">{userDetails?.user_id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Merge className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-start">Joined</p>
                    <p className="text-sm text-gray-600">{new Date(userDetails?.creation).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mars className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm text-gray-600">{userDetails?.gender}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-start">Date Of Birth</p>
                    <p className="text-sm text-gray-600">{userDetails?.date_of_birth}</p>
                  </div>
                </div>
              </div>
            </CardContent>
      </Card>  : <h1>Loading....</h1>
      }
    </div>
  );
}
