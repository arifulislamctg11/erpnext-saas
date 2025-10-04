"use client";

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
import { TrendingUp, TrendingDown, Plus, Columns } from "lucide-react";

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
          className={`flex items-center ${
            trend === "up" ? "text-green-600" : "text-red-600"
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
        console.log("hello", data);
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
  }, [companyName]); // ✅ run only once on mount

  console.log(employeeData);

  return (
    <div className="flex h-screen  overflow-hidden bg-background">
      {/* Dashboard Content */}
      <main className="flex-1 p-3   h-screen   bg-gray-300 overflow-y-auto space-y-3">
        {/* Metrics Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            title="Total Revenue"
            value="$1,250.00"
            change="+12.5%"
            trend="up"
            description="Trending up this month"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricCard
            title="New Customers"
            value="1,234"
            change="-20%"
            trend="down"
            description="Down 20% this period"
            icon={<Users className="h-4 w-4" />}
          />
          <MetricCard
            title="Active Accounts"
            value="45,678"
            change="+12.5%"
            trend="up"
            description="Strong user retention"
            icon={<UserCheck className="h-4 w-4" />}
          />
          <MetricCard
            title="Growth Rate"
            value="4.5%"
            change="+4.5%"
            trend="up"
            description="Steady performance increase"
            icon={<Activity className="h-4 w-4" />}
          />
        </div> */}
        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">undefined</div>
          </CardHeader>
        </Card> */}
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
                        <UserFormDialog>
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
