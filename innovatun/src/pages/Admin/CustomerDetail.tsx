import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ArrowLeft, Mail, Phone, Calendar, CreditCard, FileText } from "lucide-react";
import { api } from "../../api";
import { toast } from "sonner";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>([]);
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);

  type CustomerProfile = {
    email: string;
    name: string;
    phone?: string;
    signupDate?: string;
    lastLogin?: string;
    status?: string;
    plan?: string;
    totalSpent?: number;
    currency?: string;
  };

  type CustomerSubscription = {
    id: string;
    plan: string;
    status: string;
    startDate: string;
    endDate: string | null;
    nextBillingDate: string | null;
    amount: number;
    currency: string;
  };

  type CustomerPayment = {
    id: string;
    amount: number;
    currency: string;
    status: string;
    date: string;
    method?: string;
    transactionId?: string;
  };

  type CustomerInvoice = {
    id: string;
    number: string;
    amount: number;
    currency: string;
    status: string;
    date: string;
    dueDate?: string;
    downloadUrl?: string;
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

  const coerceSubs = useCallback((docs: unknown[]): CustomerSubscription[] => {
    if (!Array.isArray(docs)) return [];
    return docs.map((raw) => {
      const d = raw as Record<string, unknown>;
      const start = d["currentPeriodStart"] || d["createdAt"];
      const end = d["currentPeriodEnd"] || null;
      return {
        id: String(d["_id"] || d["id"] || Math.random().toString(36).slice(2, 10)),
        plan: String(d["planName"] || d["plan"] || ""),
        status: String(d["status"] || "").toLowerCase(),
        startDate: start ? String(new Date(start as string | number | Date).toISOString().slice(0, 10)) : "",
        endDate: end ? String(new Date(end as string | number | Date).toISOString().slice(0, 10)) : null,
        nextBillingDate: end ? String(new Date(end as string | number | Date).toISOString().slice(0, 10)) : null,
        amount: parseAmount(d["amount"] || d["price"] || d["unitAmount"] || 0),
        currency: String(d["currency"] || d["currencyCode"] || "USD"),
      };
    });
  }, []);

  const subsToPayments = useCallback((subs: CustomerSubscription[], email: string): CustomerPayment[] =>
    subs.map((s) => ({
      id: `${email}-${s.id}`,
      amount: s.amount,
      currency: s.currency,
      status: s.status === "active" ? "paid" : s.status,
      date: s.startDate,
      method: "Stripe",
      transactionId: s.id,
    })), []);

  const fetchAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const email = decodeURIComponent(id);

      
      let pObj: Record<string, unknown> | undefined = undefined;
      try {
        const profileRes = await fetch(`${api.baseUrl}/customers/${encodeURIComponent(email)}`, { credentials: 'include' });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          pObj = (Array.isArray(profileData) ? profileData[0] : (profileData?.customer ?? profileData)) as Record<string, unknown> | undefined;
        }
      } catch { /* fallback below */ }

      
      if (!pObj) {
        try {
          const listRes = await fetch(`${api.baseUrl}/customers`, { credentials: 'include' });
          if (listRes.ok) {
            const listData: unknown = await listRes.json();
            const arr = Array.isArray(listData)
              ? listData as Array<Record<string, unknown>>
              : Array.isArray((listData as any)?.customers)
                ? ((listData as any).customers as Array<Record<string, unknown>>)
                : Array.isArray((listData as any)?.users)
                  ? ((listData as any).users as Array<Record<string, unknown>>)
                  : [];
            pObj = arr.find(u => String((u.email as string | undefined) ?? '').toLowerCase() === email.toLowerCase());
          }
        } catch { /* final fallback below */ }
      }

      
      if (pObj) {
        const name = String((pObj?.["name"] as string | undefined) ?? "");
        const signupDate = pObj?.["createdAt"] ? new Date(pObj["createdAt"] as any).toISOString().slice(0, 10) : undefined;
        const lastLogin = pObj?.["lastLogin"] ? new Date(pObj["lastLogin"] as any).toISOString().slice(0, 10) : undefined;
        const status = String((pObj?.["status"] as string | undefined) ?? "active");
        const plan = String((pObj?.["planName"] as string | undefined) ?? (pObj?.["plan"] as string | undefined) ?? "");
        const totalSpent = parseAmount(pObj?.["totalSpent"]);
        const phone = String((pObj?.["phone"] as string | undefined) ?? "");
        const currency = String((pObj?.["currency"] as string | undefined) ?? "USD");
        setProfile({ email, name, phone, signupDate, lastLogin, status, plan, totalSpent, currency });
      } else {
        
        setProfile({ email, name: email, currency: 'USD' });
      }

      
      const subRes = await fetch(`${api.baseUrl}${api.subscriptions}/${encodeURIComponent(email)}`, { credentials: 'include' });
      const subData = await subRes.json();
      const subs = (subData?.success && Array.isArray(subData.subscriptions)) ? subData.subscriptions : (Array.isArray(subData) ? subData : []);
      const coercedSubs = coerceSubs(subs);
      setSubscriptions(coercedSubs);

      
      setPayments(subsToPayments(coercedSubs, email));

      
      const derivedTotal = coercedSubs.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
      const derivedCurrency = coercedSubs[0]?.currency || 'USD';
      setProfile(prev => {
        if (!prev) return prev;
        const current = Number(prev.totalSpent || 0);
        if (current > 0) return prev;
        return { ...prev, totalSpent: derivedTotal, currency: prev.currency || derivedCurrency };
      });

      
      setInvoices(coercedSubs.map((s, idx) => ({
        id: `${s.id}-inv`,
        number: `INV-${String(idx + 1).padStart(3, '0')}`,
        amount: s.amount,
        currency: s.currency,
        status: s.status === 'active' ? 'paid' : 'open',
        date: s.startDate,
        dueDate: s.endDate || undefined,
        downloadUrl: undefined,
      })));
    } catch (err) {
      console.error("Load customer detail error", err);
      toast.error("Failed to load customer details");
    } finally {
      setLoading(false);
    }
  }, [id, coerceSubs, subsToPayments]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  

  if (loading) {
    return (
      <div className="p-6">
        <div className="py-20 text-center text-gray-500">Loading customer details…</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      
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
            <h1 className="text-3xl font-bold text-gray-900">{profile?.name || profile?.email}</h1>
            <p className="text-gray-600 mt-2">{profile?.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={profile?.status === 'active' ? 'default' : 'secondary'}>
              {profile?.status}
            </Badge>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.plan}</div>
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
            <div className="text-2xl font-bold">{profile?.totalSpent} {profile?.currency}</div>
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
            <div className="text-2xl font-bold">{profile?.signupDate}</div>
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
            <div className="text-2xl font-bold">{profile?.lastLogin}</div>
            <p className="text-xs text-muted-foreground">
              Most recent activity
            </p>
          </CardContent>
        </Card>
      </div>

      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Basic customer details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={profile?.name || profile?.email} />
                  <AvatarFallback>{(profile?.name || profile?.email || "").slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{profile?.name || profile?.email}</div>
                  <div className="text-sm text-gray-500">{profile?.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{profile?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{profile?.phone || '—'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Signup Date</p>
                    <p className="text-sm text-gray-600">{profile?.signupDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-gray-600">{profile?.lastLogin}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        
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
                      <div className="text-right">
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                          {invoice.status}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          {invoice.amount} {invoice.currency}
                        </p>
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
