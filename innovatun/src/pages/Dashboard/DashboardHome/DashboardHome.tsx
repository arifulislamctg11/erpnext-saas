"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  UserCheck,
  Plus,
  Columns,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../../components/ui/button";

// TypeScript interfaces for type safety
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
  icon: React.ReactNode;
}

interface ChartDataPoint {
  date: string;
  visitors: number;
  baseline: number;
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
const chartData: ChartDataPoint[] = [
  { date: "Apr 7", visitors: 2400, baseline: 1800 },
  { date: "Apr 13", visitors: 1398, baseline: 1600 },
  { date: "Apr 19", visitors: 9800, baseline: 2200 },
  { date: "Apr 26", visitors: 3908, baseline: 1900 },
  { date: "May 2", visitors: 4800, baseline: 2100 },
  { date: "May 8", visitors: 3800, baseline: 1950 },
  { date: "May 14", visitors: 4300, baseline: 2050 },
  { date: "May 21", visitors: 2400, baseline: 1800 },
  { date: "May 28", visitors: 1398, baseline: 1600 },
  { date: "Jun 3", visitors: 9800, baseline: 2200 },
  { date: "Jun 9", visitors: 3908, baseline: 1900 },
  { date: "Jun 15", visitors: 4800, baseline: 2100 },
  { date: "Jun 22", visitors: 3800, baseline: 1950 },
  { date: "Jun 30", visitors: 4300, baseline: 2050 },
];

const tableData: TableRow[] = [
  {
    header: "Q1 Performance Review",
    sectionType: "Analytics",
    status: "Active",
    target: "95%",
    limit: "100 users",
    reviewer: "John Smith",
  },
  {
    header: "Customer Acquisition",
    sectionType: "Marketing",
    status: "Pending",
    target: "80%",
    limit: "500 leads",
    reviewer: "Sarah Johnson",
  },
  {
    header: "Product Launch",
    sectionType: "Development",
    status: "Completed",
    target: "100%",
    limit: "50 features",
    reviewer: "Mike Davis",
  },
];

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
  const [selectedPeriod, setSelectedPeriod] = useState<
    "3months" | "30days" | "7days"
  >("3months");
  const [activeTab, setActiveTab] = useState("outline");

  const periodLabels = {
    "3months": "Last 3 months",
    "30days": "Last 30 days",
    "7days": "Last 7 days",
  };

  return (
    <div className="flex h-screen  overflow-hidden bg-background">
      {/* Dashboard Content */}
      <main className="flex-1 p-3   h-screen   bg-gray-300 overflow-y-auto space-y-3">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
        </div>
        <div className=" mb-10  flex flex-col gap-3">
          {/* Chart Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Total Visitors</CardTitle>
                  <CardDescription>Total for the last 3 months</CardDescription>
                </div>
                <div className="flex space-x-2">
                  {(
                    Object.keys(periodLabels) as Array<
                      keyof typeof periodLabels
                    >
                  ).map((period) => (
                    <Button
                      key={period}
                      variant={
                        selectedPeriod === period ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {periodLabels[period]}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      className="text-xs"
                    />
                    <YAxis hide />
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      stackId="1"
                      stroke="hsl(var(--muted-foreground))"
                      fill="hsl(var(--muted))"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

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
                    <TabsList>
                      <TabsTrigger value="outline">Outline</TabsTrigger>
                      <TabsTrigger value="performance">
                        Past Performance
                        <Badge variant="secondary" className="ml-2">
                          3
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="personnel">
                        Key Personnel
                        <Badge variant="secondary" className="ml-2">
                          2
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="documents">
                        Focus Documents
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Columns className="h-4 w-4 mr-2" />
                        Customize Columns
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                      </Button>
                    </div>
                  </div>

                  <TabsContent value={activeTab} className="mt-6">
                    <div className="border rounded-lg">
                      <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/50 font-medium text-sm">
                        <div>Header</div>
                        <div>Section Type</div>
                        <div>Status</div>
                        <div>Target</div>
                        <div>Limit</div>
                        <div>Reviewer</div>
                      </div>
                      {tableData.map((row, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 "
                        >
                          <div className="font-medium">{row.header}</div>
                          <div className="text-muted-foreground">
                            {row.sectionType}
                          </div>
                          <div>
                            <Badge
                              variant={
                                row.status === "Active"
                                  ? "default"
                                  : row.status === "Pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {row.status}
                            </Badge>
                          </div>
                          <div>{row.target}</div>
                          <div className="text-muted-foreground">
                            {row.limit}
                          </div>
                          <div>{row.reviewer}</div>
                        </div>
                      ))}
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
