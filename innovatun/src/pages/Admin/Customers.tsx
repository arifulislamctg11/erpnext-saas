import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Search, Download, Eye, Filter } from "lucide-react";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  // Mock customer data - replace with actual API call
  const customers = [
    {
      id: 1,
      email: "john.doe@example.com",
      name: "John Doe",
      plan: "Premium",
      status: "active",
      signupDate: "2024-01-15",
      lastLogin: "2024-01-20",
      totalSpent: 299
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      name: "Jane Smith",
      plan: "Basic",
      status: "trial",
      signupDate: "2024-01-18",
      lastLogin: "2024-01-19",
      totalSpent: 0
    },
    {
      id: 3,
      email: "bob.wilson@example.com",
      name: "Bob Wilson",
      plan: "Premium",
      status: "cancelled",
      signupDate: "2024-01-10",
      lastLogin: "2024-01-15",
      totalSpent: 299
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesPlan = planFilter === "all" || customer.plan.toLowerCase() === planFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleExportCSV = () => {
    // Implement CSV export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Email,Name,Plan,Status,Signup Date,Last Login,Total Spent\n" +
      filteredCustomers.map(customer => 
        `${customer.email},${customer.name},${customer.plan},${customer.status},${customer.signupDate},${customer.lastLogin},${customer.totalSpent}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">Manage and view all customer information</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
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
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleExportCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            {filteredCustomers.length} customers found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Plan</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Signup Date</th>
                  <th className="text-left p-4">Last Login</th>
                  <th className="text-left p-4">Total Spent</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{customer.email}</td>
                    <td className="p-4">{customer.name}</td>
                    <td className="p-4">
                      <Badge variant="outline">{customer.plan}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={customer.status === 'active' ? 'default' : 
                                customer.status === 'trial' ? 'secondary' : 'destructive'}
                      >
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4">{customer.signupDate}</td>
                    <td className="p-4">{customer.lastLogin}</td>
                    <td className="p-4">{customer.totalSpent} TND</td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
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
