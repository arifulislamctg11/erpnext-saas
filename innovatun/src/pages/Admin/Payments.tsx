import { useEffect, useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Search, Download, Filter } from "lucide-react";
import { api } from "../../api";
import { toast } from "sonner";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  type PaymentRecord = {
    id: string | number;
    customerEmail: string;
    customerName: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod?: string;
    date: string;
    plan: string;
    transactionId?: string;
  };

  const parseAmount = (value: unknown): number => {
    if (typeof value === "number" && isFinite(value)) return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/[^0-9.,-]/g, "");
      
      const normalized = cleaned.replace(/,/g, "");
      const asNumber = parseFloat(normalized);
      return isNaN(asNumber) ? 0 : asNumber;
    }
    return 0;
  };

  type PaymentLike = Record<string, unknown>;
  type SubscriptionLike = Record<string, unknown> & { payments?: PaymentLike[] };

  const coerceToPaymentRecords = useCallback((subscriptions: SubscriptionLike[]): PaymentRecord[] => {
    if (!Array.isArray(subscriptions)) return [];

    const result: PaymentRecord[] = [];

    for (const raw of subscriptions) {
      const sub = raw as SubscriptionLike;
      const baseCustomerName = String(
        (sub["customerName"] ?? sub["name"] ?? sub["fullName"] ?? "")
      );
      const baseCustomerEmail = String(
        (sub["customerEmail"] ?? sub["email"] ?? sub["userEmail"] ?? "")
      );
      const basePlan = String(
        (sub["plan"] ?? sub["planName"] ?? sub["product"] ?? sub["tier"] ?? "")
      );
      const baseCurrency = String(sub["currency"] ?? sub["currencyCode"] ?? "TND");
      const baseAmount = parseAmount(sub["amount"] ?? sub["price"] ?? sub["unitAmount"] ?? 0);
      const baseStatus = String(sub["status"] ?? sub["payment_status"] ?? "").toLowerCase();

      if (Array.isArray(sub.payments)) {
        for (const rawP of sub.payments) {
          const p = rawP as PaymentLike;
          result.push({
            id: (p["id"] as string) || (p["transactionId"] as string) || `${(sub["id"] as string) || (sub["_id"] as string) || "sub"}-p-${Math.random().toString(36).slice(2, 8)}`,
            customerEmail: (p["customerEmail"] as string) || baseCustomerEmail,
            customerName: (p["customerName"] as string) || baseCustomerName,
            amount: parseAmount((p["amount"] as number | string) ?? baseAmount ?? 0),
            currency: (p["currency"] as string) || baseCurrency,
            status: String((p["status"] as string) ?? "").toLowerCase() || "paid",
            paymentMethod: (p["paymentMethod"] as string) || (p["method"] as string) || (sub["sessionId"] ? "Stripe" : undefined),
            date: String((p["date"] as string) ?? (p["createdAt"] as string) ?? (sub["updatedAt"] as string) ?? (sub["createdAt"] as string) ?? new Date().toISOString()).slice(0, 10),
            plan: (p["plan"] as string) || basePlan,
            transactionId: (p["transactionId"] as string) || (p["id"] as string) || (sub["subscriptionId"] as string) || (sub["sessionId"] as string) || undefined,
          });
        }
        continue;
      }

      if (baseStatus) {
        result.push({
          id: (sub["id"] as string) || (sub["_id"] as string) || Math.random().toString(36).slice(2, 10),
          customerEmail: baseCustomerEmail,
          customerName: baseCustomerName,
          amount: baseAmount,
          currency: baseCurrency,
          status: ["paid", "pending", "failed"].includes(baseStatus) ? baseStatus : (baseStatus === "active" ? "paid" : baseStatus),
          paymentMethod: (sub["paymentMethod"] as string) || (sub["method"] as string) || (sub["sessionId"] ? "Stripe" : undefined),
          date: String((sub["paymentDate"] as string) ?? (sub["updatedAt"] as string) ?? (sub["createdAt"] as string) ?? new Date().toISOString()).slice(0, 10),
          plan: basePlan,
          transactionId: (sub["transactionId"] as string) || (sub["latest_invoice"] as string) || (sub["subscriptionId"] as string) || (sub["sessionId"] as string) || undefined,
        });
      }
    }

    return result;
  }, []);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api.baseUrl}${api.subscriptions}`);
      const data = await response.json();

      if (data?.success && Array.isArray(data.subscriptions)) {
        setPayments(coerceToPaymentRecords(data.subscriptions));
      } else if (Array.isArray(data)) {
        setPayments(coerceToPaymentRecords(data));
      } else {
        toast.error("Failed to load payments from server");
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments from subscriptions:", error);
      toast.error("Network/CORS error while fetching payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [coerceToPaymentRecords]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const dateInRange = useCallback((dateStr: string): boolean => {
    if (dateFilter === "all") return true;
    const d = new Date(dateStr);
    const now = new Date();
    const start = new Date(now);

    if (dateFilter === "today") {
      return d.toDateString() === now.toDateString();
    }
    if (dateFilter === "week") {
      start.setDate(now.getDate() - 7);
      return d >= start && d <= now;
    }
    if (dateFilter === "month") {
      start.setMonth(now.getMonth() - 1);
      return d >= start && d <= now;
    }
    return true;
  }, [dateFilter]);

  const filteredPayments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const customerTerm = customerFilter.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        term === "" ||
        payment.customerEmail.toLowerCase().includes(term) ||
        payment.customerName.toLowerCase().includes(term) ||
        (payment.transactionId || "").toLowerCase().includes(term) ||
        payment.plan.toLowerCase().includes(term);

      const matchesCustomer =
        customerTerm === "" ||
        payment.customerName.toLowerCase().includes(customerTerm) ||
        payment.customerEmail.toLowerCase().includes(customerTerm);

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      const matchesDate = dateInRange(payment.date);
    
      return matchesSearch && matchesCustomer && matchesStatus && matchesDate;
  });
  }, [payments, searchTerm, customerFilter, statusFilter, dateInRange]);

  const totalRevenue = useMemo(() =>
    filteredPayments
    .filter(p => p.status === "paid")
      .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)
  , [filteredPayments]);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue} USD</div>
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Filter by customer name/email"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            />
            
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            {filteredPayments.length} payments found
          </CardDescription>
            </div>
            <Button variant="outline" onClick={fetchPayments} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
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
                  <th className="text-left p-4">Payment For</th>
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
                    <td className="p-4">{payment.paymentMethod || '-'}</td>
                    <td className="p-4">{payment.date}</td>
                    <td className="p-4">
                      <Badge variant="outline">{payment.plan || '-'}</Badge>
                    </td>
                    <td className="p-4 font-mono text-sm">{payment.transactionId || '-'}</td>
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
