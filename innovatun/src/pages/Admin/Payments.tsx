import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Search, Download, Filter, Calendar } from "lucide-react";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Mock payment data - replace with actual API call
  const payments = [
    {
      id: 1,
      customerEmail: "john.doe@example.com",
      customerName: "John Doe",
      amount: 299,
      currency: "TND",
      status: "paid",
      paymentMethod: "Credit Card",
      date: "2024-01-20",
      plan: "Premium",
      transactionId: "txn_123456789"
    },
    {
      id: 2,
      customerEmail: "jane.smith@example.com",
      customerName: "Jane Smith",
      amount: 99,
      currency: "TND",
      status: "pending",
      paymentMethod: "Bank Transfer",
      date: "2024-01-19",
      plan: "Basic",
      transactionId: "txn_987654321"
    },
    {
      id: 3,
      customerEmail: "bob.wilson@example.com",
      customerName: "Bob Wilson",
      amount: 299,
      currency: "TND",
      status: "failed",
      paymentMethod: "Credit Card",
      date: "2024-01-18",
      plan: "Premium",
      transactionId: "txn_456789123"
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredPayments
    .filter(p => p.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Customer Email,Customer Name,Amount,Currency,Status,Payment Method,Date,Plan,Transaction ID\n" +
      filteredPayments.map(payment => 
        `${payment.customerEmail},${payment.customerName},${payment.amount},${payment.currency},${payment.status},${payment.paymentMethod},${payment.date},${payment.plan},${payment.transactionId}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">View and manage all payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue} TND</div>
            <p className="text-xs text-muted-foreground">
              From {filteredPayments.filter(p => p.status === "paid").length} successful payments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPayments.filter(p => p.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPayments.filter(p => p.status === "failed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payments..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleExportCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            {filteredPayments.length} payments found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Payment Method</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Plan</th>
                  <th className="text-left p-4">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{payment.customerName}</div>
                        <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{payment.amount} {payment.currency}</td>
                    <td className="p-4">
                      <Badge 
                        variant={payment.status === 'paid' ? 'default' : 
                                payment.status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="p-4">{payment.paymentMethod}</td>
                    <td className="p-4">{payment.date}</td>
                    <td className="p-4">
                      <Badge variant="outline">{payment.plan}</Badge>
                    </td>
                    <td className="p-4 font-mono text-sm">{payment.transactionId}</td>
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
