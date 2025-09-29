import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Search, Filter, Calendar, AlertCircle } from "lucide-react";

export default function Subscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock subscription data - replace with actual API call
  const subscriptions = [
    {
      id: 1,
      customerEmail: "john.doe@example.com",
      customerName: "John Doe",
      plan: "Premium",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      nextBillingDate: "2024-02-15",
      amount: 299,
      currency: "TND",
      trialDays: 0
    },
    {
      id: 2,
      customerEmail: "jane.smith@example.com",
      customerName: "Jane Smith",
      plan: "Basic",
      status: "trialing",
      startDate: "2024-01-18",
      endDate: "2024-02-18",
      nextBillingDate: "2024-02-18",
      amount: 99,
      currency: "TND",
      trialDays: 14
    },
    {
      id: 3,
      customerEmail: "bob.wilson@example.com",
      customerName: "Bob Wilson",
      plan: "Premium",
      status: "canceled",
      startDate: "2024-01-10",
      endDate: "2024-01-15",
      nextBillingDate: null,
      amount: 299,
      currency: "TND",
      trialDays: 0
    }
  ];

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeSubscriptions = filteredSubscriptions.filter(s => s.status === "active").length;
  const trialingSubscriptions = filteredSubscriptions.filter(s => s.status === "trialing").length;
  const canceledSubscriptions = filteredSubscriptions.filter(s => s.status === "canceled").length;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-600 mt-2">Manage customer subscriptions and billing cycles</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trialing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{trialingSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              In trial period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{canceledSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              No longer active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trialing">Trialing</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            {filteredSubscriptions.length} subscriptions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Plan</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Start Date</th>
                  <th className="text-left p-4">End Date</th>
                  <th className="text-left p-4">Next Billing</th>
                  <th className="text-left p-4">Trial Days</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{subscription.customerName}</div>
                        <div className="text-sm text-gray-500">{subscription.customerEmail}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{subscription.plan}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={subscription.status === 'active' ? 'default' : 
                                subscription.status === 'trialing' ? 'secondary' : 'destructive'}
                      >
                        {subscription.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium">{subscription.amount} {subscription.currency}</td>
                    <td className="p-4">{subscription.startDate}</td>
                    <td className="p-4">{subscription.endDate}</td>
                    <td className="p-4">
                      {subscription.nextBillingDate ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{subscription.nextBillingDate}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {subscription.trialDays > 0 ? (
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4 text-blue-500" />
                          <span>{subscription.trialDays} days</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
