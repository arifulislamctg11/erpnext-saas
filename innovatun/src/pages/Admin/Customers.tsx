import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Search, Download, Eye, Filter } from "lucide-react";
import { DataTable } from "../../components/ui/table/components/data-table";
import { customersColumns, type Customer } from "../../components/ui/table/columns/customers-columns";
import { api } from "../../api";
import { Link } from "react-router-dom";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        
        const candidates = [
          `${api.baseUrl}/customers`,
         
        ];
        let list: Array<Record<string, unknown>> | null = null;
        for (const url of candidates) {
          try {
            const res = await fetch(url, { credentials: "include" });
            if (!res.ok) continue;
            const data: unknown = await res.json();
            if (Array.isArray(data)) { list = data as Array<Record<string, unknown>>; break; }
            if (typeof data === 'object' && data !== null) {
              const obj = data as { customers?: unknown[]; users?: unknown[] };
              if (Array.isArray(obj.customers)) { list = obj.customers as Array<Record<string, unknown>>; break; }
              if (Array.isArray(obj.users)) { list = obj.users as Array<Record<string, unknown>>; break; }
            }
          } catch { /* try next */ }
        }
        if (!list) throw new Error("Failed to load customers: no endpoint responded");

        const mapped: Customer[] = list.map((u, idx) => {
          const email = (u.email as string | undefined) ?? "";
          const first = (u.firstName as string | undefined) ?? "";
          const last = (u.lastName as string | undefined) ?? "";
          const username = (u.username as string | undefined) ?? "";
          const company = (u.companyName as string | undefined) ?? "";
          const nameCandidate = (u.name as string | undefined) ?? `${first}${(first || last ? " " : "")}${last}`;
          const name = (nameCandidate || company || username || "").trim();
          const plan = ((u.planName as string | undefined) ?? (u.plan as string | undefined) ?? "—");
          const status = (u.status as string | undefined) ?? (((u.isActive as boolean | undefined) ?? false) ? "active" : "inactive");
          const created = (u.createdAt as string | number | Date | undefined);
          const lastLogin = (u.lastLogin as string | number | Date | undefined);
          const totalSpent = Number((u.totalSpent as number | string | undefined) ?? 0);
          return {
            id: Number((u.id as number | string | undefined) ?? idx + 1),
            email,
            name,
            plan: String(plan),
            amount: String((u.planAmount as string | undefined) ?? ""), 
            status: String(status),
            signupDate: created ? new Date(created).toISOString().slice(0, 10) : "",
            lastLogin: lastLogin ? new Date(lastLogin).toISOString().slice(0, 10) : "",
            totalSpent,
          };
        });
        if (alive) setCustomers(mapped);
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

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
          {error && (
            <div className="mb-4 text-sm text-red-600">{error}</div>
          )}
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading customers…</div>
          ) : (
            <DataTable
              columns={[
                ...customersColumns,
                {
                  id: "actions",
                  header: "Actions",
                  cell: ({ row }) => {
                    const email = (row.original as Customer).email;
                    return (
                      <Link to={`/admin/customers/${encodeURIComponent(email)}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    );
                  },
                },
              ]}
              data={filteredCustomers}
              searchKey="email"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
