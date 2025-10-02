import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Search, Filter, Calendar } from "lucide-react";
import { api } from "../../api";
import { toast } from "sonner";

export default function Subscriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<AdminSubscriptionRecord[]>([]);

  type AdminSubscriptionRecord = {
    id: string;
    customerEmail: string;
    customerName: string;
    plan: string;
    status: string;
    amount: number;
    currency: string;
    startDate: string;
    endDate: string | null;
    nextBillingDate: string | null;
    trialDays: number;
  };

  const parseAmount = (value: unknown): number => {
    if (typeof value === "number" && isFinite(value)) return value;
    if (typeof value === "string") {
      const normalized = value.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
      const asNumber = parseFloat(normalized);
      return isNaN(asNumber) ? 0 : asNumber;
    }
    return 0;
  };

  const coerce = useCallback((docs: unknown[]): AdminSubscriptionRecord[] => {
    if (!Array.isArray(docs)) return [];
    return docs.map((raw) => {
      const d = raw as Record<string, unknown>;
      const status = String((d["status"]) || "").toLowerCase();
      const start = d["currentPeriodStart"] || d["createdAt"];
      const end = d["currentPeriodEnd"] || null;
      return {
        id: String(d["_id"] || d["id"] || Math.random().toString(36).slice(2, 10)),
        customerEmail: String(d["email"] || ""),
        customerName: String(d["customerName"] || d["name"] || ""),
        plan: String(d["planName"] || d["plan"] || ""),
        status,
        amount: parseAmount(d["amount"] || d["price"] || d["unitAmount"] || 0),
        currency: String(d["currency"] || d["currencyCode"] || "USD"),
        startDate: start ? String(new Date(start as string | number | Date).toISOString().slice(0, 10)) : "",
        endDate: end ? String(new Date(end as string | number | Date).toISOString().slice(0, 10)) : null,
        nextBillingDate: end ? String(new Date(end as string | number | Date).toISOString().slice(0, 10)) : null,
        trialDays: Number(d["trialDays"] || 0),
      };
    });
  }, []);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api.baseUrl}${api.subscriptions}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.subscriptions)) {
        setSubscriptions(coerce(data.subscriptions));
      } else if (Array.isArray(data)) {
        setSubscriptions(coerce(data));
      } else {
        toast.error("Failed to load subscriptions");
        setSubscriptions([]);
      }
    } catch (err) {
      console.error("Admin subscriptions fetch error", err);
      toast.error("Network/CORS error while fetching subscriptions");
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [coerce]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const filteredSubscriptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return subscriptions.filter((s) => {
      const matchesSearch =
        term === "" ||
        s.customerEmail.toLowerCase().includes(term) ||
        s.customerName.toLowerCase().includes(term) ||
        s.plan.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchTerm, statusFilter]);

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
          <div className="mt-2">
            <Button variant="outline" onClick={fetchSubscriptions} disabled={loading}>
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
                  <th className="text-left p-4">Plan</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Start Date</th>
                  <th className="text-left p-4">End Date</th>
                  <th className="text-left p-4">Next Billing</th>
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
