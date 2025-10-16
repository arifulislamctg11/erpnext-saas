import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent } from "../../../components/ui/tabs";
import { TrendingUp, TrendingDown, Plus, Columns, Eye } from "lucide-react";

import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { api } from "../../../api";
import { useAuth } from "../../../contexts/use-auth";
import { ProfileUrl } from "../../../api/Urls";
import { Link } from "react-router-dom";
import { UserFormDialog } from "./components/dailog";

// TypeScript interfaces for type safety
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
  icon: React.ReactNode;
}

interface TableRow {
  header: string;
  sectionType: string;
  status: "Active" | "Pending" | "Completed";
  target: string;
  limit: string;
  reviewer: string;
}

// Sample data with proper typing

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  description,
  icon,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center space-x-2 text-xs">
        <div
          className={`flex items-center ${trend === "up" ? "text-green-600" : "text-red-600"
            }`}
        >
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span className="ml-1">{change}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState("outline");
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [companyName, setCompanyData] = useState("");
  const [refetchEmployee, setRefetchEmployee] = useState(true);
  const { user } = useAuth();
  console.log(user?.email);

  useEffect(() => {
    //  if (!user?.email) return;
    const userData = async () => {
      try {
        const response = await fetch(
          `${api.baseUrl}${ProfileUrl}?email=${user?.email}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
      
        setCompanyData(data?.data?.companyName);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
  }, [user?.email]);
  console.log("company name", companyName);

  console.log(employeeData);
  useEffect(() => {
    if (!companyName) return; // don’t fetch until we have a value

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${api.baseUrl}/user-company/${companyName}`
        );
        const data = await response.json();
        console.log("bane", data);
        setEmployeeData(data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refetchEmployee, companyName]); // ✅ run only once on mount

  console.log(employeeData);

  return (
    <div className="flex h-screen  overflow-hidden bg-background">
      {/* Dashboard Content */}
      <main className="flex-1 p-3  h-screen   bg-gray-300 overflow-y-auto space-y-3">

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-left">Please check you email to get the user credentials we already have send you a temporary password, please reset your password once you logged in. click here to access your ERP
              </p>
            </div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="http://56.228.18.230:8001/"
              className="inline-block rounded-2xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-500/30 px-8 py-3 text-lg font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-300/40"
            >
              Login
            </a>

          </div>
        </div>

        <div className=" mb-10  flex flex-col gap-3">
          {/* Bottom Section with Tabs */}
          <div className="mb-10">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Link to="/">
                          <CardTitle className="text-sm font-semibold">
                            Employee/ Users
                          </CardTitle>
                        </Link>
                      </div>
                      <div className="flex space-x-2">
                        <UserFormDialog employeeCount={employeeData?.length} companyName={companyName} setRefetchEmployee={setRefetchEmployee}>
                          <Button size="sm">
                            <Plus className="h-4 w-4 " />
                            Add User
                          </Button>
                        </UserFormDialog>
                      </div>
                    </div>

                    <TabsContent value={activeTab} className="mt-6">
                      <div className="border rounded-lg">
                        <div className="rounded-md border">
                          <Table className="text-left">
                            <TableHeader>
                              <TableRow className="">
                                <TableHead>User Id</TableHead>
                                <TableHead>Employee Name</TableHead>
                                <TableHead>Date of Birth</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {employeeData.map((item: any, index: number) => {
                                return (
                                  <TableRow key={index}>
                                    <TableCell className="">
                                      {item?.user_id}
                                    </TableCell>
                                    <TableCell>{item?.employee_name}</TableCell>
                                    <TableCell>{item?.date_of_birth}</TableCell>
                                    <TableCell>{item?.gender}</TableCell>
                                    <TableCell>{item?.company}</TableCell>
                                    <TableCell>
                                      <div>
                                        <Badge
                                          variant={
                                            item.status === "Active"
                                              ? "default"
                                              : item.status === "Inactive"
                                                ? "secondary"
                                                : "outline"
                                          }
                                        >
                                          {item.status}
                                        </Badge>
                                      </div>
                                    </TableCell>
                                     <TableCell>
                                     <Link to={`/dashboard/user/${encodeURIComponent(item?.user_id)}`}>
                                        <Button variant="outline" size="sm">
                                          <Eye className="h-4 w-4 mr-2" />
                                          View
                                        </Button>
                                      </Link>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}

                              {/* <TableRow>
                                  <TableCell className="text-center">
                                    No results.
                                  </TableCell>
                                </TableRow> */}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
