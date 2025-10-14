import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ArrowLeft, Mail, Phone, Calendar, CreditCard, FileText , CalendarDays, BookCheck, MapPin, Banknote, Eye, ShieldBan, ShieldCheck} from "lucide-react";
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


  return (
    <div className="p-6">
      
      <div className="mb-8">
        <div className="flex flex-row justify-between items-center space-x-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/customers")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          {
             id ? <Button variant="outline" size="sm">
                <ShieldBan className="h-4 w-4 mr-2" />
                Disable
              </Button> : <Button variant='outline' size="sm">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Enable
              </Button>
             }
        </div>
      </div>
       <Card>
            <CardHeader>
              <CardTitle>User Information {id}</CardTitle>
              <CardDescription>
                Basic user details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={'AHAN'} />
                  <AvatarFallback>{('AAA').slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">fasdfasfd</div>
                  <div className="text-sm text-gray-500">fasdfasdfas</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-start">Email</p>
                    <p className="text-sm text-gray-600">asdfsdfas</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">sfasfdsdaf</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Signup Date</p>
                    <p className="text-sm text-gray-600">fsdfsdf</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-gray-600">dgdsf</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>  
    </div>
  );
}
