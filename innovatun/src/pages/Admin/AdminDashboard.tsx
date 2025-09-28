import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, CreditCard, FileText, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  // Mock data - replace with actual API calls
  const stats = [
    {
      title: "Total Customers",
      value: "1,234",
      description: "+12% from last month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Total Revenue",
      value: "45,678 TND",
      description: "+8% from last month",
      icon: CreditCard,
      color: "text-green-600"
    },
    {
      title: "Active Subscriptions",
      value: "892",
      description: "+5% from last month",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Monthly Growth",
      value: "12.5%",
      description: "+2.1% from last month",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the management panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>
              Latest customer registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock recent customers */}
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">john.doe@example.com</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Active
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">jane.smith@example.com</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Trial
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              Latest payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock recent payments */}
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Premium Plan</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  +299 TND
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Basic Plan</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
                <span className="text-sm font-medium text-green-600">
                  +99 TND
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
