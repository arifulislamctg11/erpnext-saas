import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, CreditCard, FileText, TrendingUp } from "lucide-react";
import { api } from "../../api";

interface Stats {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface RecentCustomer {
  email: string;
  name: string;
  signupDate: string;
  status: string;
}

interface RecentPayment {
  plan: string;
  amount: number;
  currency: string;
  date: string;
  customerEmail: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([]);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch customers count
      const customersRes = await fetch(`${api.baseUrl}/customers`, { credentials: 'include' });
      const customersData = await customersRes.json();
      
      let customersList: Array<Record<string, unknown>> = [];
      if (customersData?.success && Array.isArray(customersData.customers)) {
        customersList = customersData.customers;
      } else if (Array.isArray(customersData)) {
        customersList = customersData;
      }
      
      const totalCustomers = customersList.length;

      // Fetch all subscriptions to calculate revenue and active subscriptions
      const subscriptionsRes = await fetch(`${api.baseUrl}${api.subscriptions}`, { credentials: 'include' });
      const subscriptionsData = await subscriptionsRes.json();
      
      let subscriptions: Array<Record<string, unknown>> = [];
      if (subscriptionsData?.success && Array.isArray(subscriptionsData.subscriptions)) {
        subscriptions = subscriptionsData.subscriptions;
      } else if (Array.isArray(subscriptionsData)) {
        subscriptions = subscriptionsData;
      }

      // Calculate total revenue using same logic as Payments page
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

      // Coerce subscriptions to payment records like in Payments page
      const coerceToPaymentRecords = (subscriptions: Array<Record<string, unknown>>) => {
        const result: Array<{amount: number, status: string, currency: string}> = [];
        
        for (const raw of subscriptions) {
          const sub = raw as Record<string, unknown>;
          const baseAmount = parseAmount(sub["amount"] ?? sub["price"] ?? sub["unitAmount"] ?? 0);
          const baseStatus = String(sub["status"] ?? "").toLowerCase();
          const baseCurrency = String(sub["currency"] ?? "TND");

          if (Array.isArray(sub.payments)) {
            for (const rawP of sub.payments) {
              const p = rawP as Record<string, unknown>;
              result.push({
                amount: parseAmount(p["amount"] ?? baseAmount ?? 0),
                status: String(p["status"] ?? "").toLowerCase() || "paid",
                currency: String(p["currency"] ?? baseCurrency)
              });
            }
            continue;
          }

          if (baseStatus) {
            result.push({
              amount: baseAmount,
              status: ["paid", "pending", "failed"].includes(baseStatus) ? baseStatus : (baseStatus === "active" ? "paid" : baseStatus),
              currency: baseCurrency
            });
          }
        }
        return result;
      };

      const paymentRecords = coerceToPaymentRecords(subscriptions);
      const totalRevenue = paymentRecords
        .filter(p => p.status === "paid")
        .reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

      // Count active subscriptions (same logic as Subscriptions page)
      const coerceSubscriptions = (docs: Array<Record<string, unknown>>) => {
        return docs.map((raw) => {
          const d = raw as Record<string, unknown>;
          const status = String((d["status"]) || "").toLowerCase();
          return {
            id: String(d["_id"] || d["id"] || Math.random().toString(36).slice(2, 10)),
            customerEmail: String(d["email"] || ""),
            customerName: String(d["customerName"] || d["name"] || ""),
            plan: String(d["planName"] || d["plan"] || ""),
            status,
            amount: parseAmount(d["amount"] || d["price"] || d["unitAmount"] || 0),
            currency: String(d["currency"] || d["currencyCode"] || "USD"),
          };
        });
      };

      const coercedSubscriptions = coerceSubscriptions(subscriptions);
      const activeSubscriptions = coercedSubscriptions.filter(s => s.status === "active").length;

      // Fetch recent customers (last 5)
      const recentCustomersData = customersList.slice(0, 5).map((customer: Record<string, unknown>) => ({
        email: String(customer.email || ''),
        name: String(customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : customer.username || customer.email || ''),
        signupDate: String(customer.createdAt || new Date().toISOString()),
        status: String(customer.status || 'active')
      }));

      // Get recent payments from payment records (last 5)
      const recentPaymentsData = paymentRecords
        .filter(p => p.status === "paid")
        .slice(0, 5)
        .map((payment) => {
          // Find corresponding subscription for plan and email info
          const correspondingSub = subscriptions.find(sub => {
            const subAmount = parseAmount(sub.amount || sub.price || sub.unitAmount || 0);
            return Math.abs(subAmount - payment.amount) < 0.01; // Match by amount
          });
          
          return {
            plan: String(correspondingSub?.planName || correspondingSub?.plan || ''),
            amount: payment.amount,
            currency: payment.currency,
            date: String(correspondingSub?.createdAt || new Date().toISOString()),
            customerEmail: String(correspondingSub?.email || '')
          };
        });

      // Update stats
      setStats([
        {
          title: "Total Customers",
          value: totalCustomers.toLocaleString(),
          description: "Registered users",
          icon: Users,
          color: "text-blue-600"
        },
    {
      title: "Total Revenue",
          value: `${totalRevenue.toLocaleString()} USD`,
          description: `From ${paymentRecords.filter(p => p.status === "paid").length} successful payments`,
      icon: CreditCard,
      color: "text-green-600"
    },
        {
          title: "Active Subscriptions",
          value: activeSubscriptions.toString(),
          description: "Currently active",
          icon: FileText,
          color: "text-purple-600"
        },
        {
          title: "Total Plans",
          value: "4",
          description: "Available subscription plans",
          icon: TrendingUp,
          color: "text-orange-600"
        }
      ]);

      setRecentCustomers(recentCustomersData);
      setRecentPayments(recentPaymentsData);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setStats([]);
      setRecentCustomers([]);
      setRecentPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
              {recentCustomers.length === 0 ? (
                <p className="text-sm text-gray-500">No recent customers</p>
              ) : (
                recentCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                      <p className="text-sm font-medium">{customer.email}</p>
                      <p className="text-xs text-gray-500">{customer.name}</p>
                </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {customer.status}
                </span>
              </div>
                ))
              )}
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
              {recentPayments.length === 0 ? (
                <p className="text-sm text-gray-500">No recent payments</p>
              ) : (
                recentPayments.map((payment, index) => (
                  <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                      <p className="text-sm font-medium">{payment.plan}</p>
                      <p className="text-xs text-gray-500">{payment.customerEmail}</p>
                </div>
                <span className="text-sm font-medium text-green-600">
                      +{payment.amount} {payment.currency}
                </span>
              </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}