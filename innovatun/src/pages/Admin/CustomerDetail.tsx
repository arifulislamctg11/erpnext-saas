import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ArrowLeft, Edit, Mail, Phone, Calendar, CreditCard, FileText, Download } from "lucide-react";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock customer data - replace with actual API call
  const customer = {
    id: 1,
    email: "john.doe@example.com",
    name: "John Doe",
    phone: "+216 12 345 678",
    signupDate: "2024-01-15",
    lastLogin: "2024-01-20",
    status: "active",
    plan: "Premium",
    totalSpent: 299,
    currency: "TND"
  };

  // Mock customer subscriptions
  const subscriptions = [
    {
      id: 1,
      plan: "Premium",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      nextBillingDate: "2024-02-15",
      amount: 299,
      currency: "TND"
    }
  ];

  // Mock customer payments
  const payments = [
    {
      id: 1,
      amount: 299,
      currency: "TND",
      status: "paid",
      date: "2024-01-15",
      method: "Credit Card",
      transactionId: "txn_123456789"
    }
  ];

  // Mock customer invoices
  const invoices = [
    {
      id: 1,
      number: "INV-001",
      amount: 299,
      currency: "TND",
      status: "paid",
      date: "2024-01-15",
      dueDate: "2024-01-15",
      downloadUrl: "/invoice-INV-CS_TEST_.pdf"
    }
  ];

  const handleDownloadInvoice = (invoiceId: number) => {
    // Implement invoice download
    console.log("Downloading invoice:", invoiceId);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/customers")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Customers</span>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600 mt-2">{customer.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
              {customer.status}
            </Badge>
            <Button variant="outline" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit Customer</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Customer Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.plan}</div>
            <p className="text-xs text-muted-foreground">
              Active subscription
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.totalSpent} {customer.currency}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signup Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.signupDate}</div>
            <p className="text-xs text-muted-foreground">
              Customer since
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.lastLogin}</div>
            <p className="text-xs text-muted-foreground">
              Most recent activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Basic customer details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Signup Date</p>
                    <p className="text-sm text-gray-600">{customer.signupDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-gray-600">{customer.lastLogin}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
              <CardDescription>
                All subscription plans and billing cycles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{subscription.plan}</h3>
                        <p className="text-sm text-gray-600">
                          {subscription.startDate} - {subscription.endDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                          {subscription.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          {subscription.amount} {subscription.currency}
                        </p>
                      </div>
                    </div>
                    {subscription.nextBillingDate && (
                      <p className="text-sm text-gray-500 mt-2">
                        Next billing: {subscription.nextBillingDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                All payment transactions and receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{payment.method}</p>
                          <p className="text-sm text-gray-600">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'}>
                          {payment.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          {payment.amount} {payment.currency}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Transaction ID: {payment.transactionId}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                All generated invoices and receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{invoice.number}</p>
                          <p className="text-sm text-gray-600">
                            {invoice.date} - Due: {invoice.dueDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                            {invoice.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            {invoice.amount} {invoice.currency}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="flex items-center space-x-2"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
