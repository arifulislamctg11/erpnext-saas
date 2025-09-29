import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../../badge"
import { Button } from "../../button"
import { ArrowUpDown, Mail, User, Calendar, Activity } from "lucide-react"

export type Customer = {
  id: number
  email: string
  name: string
  plan: string
  status: string
  signupDate: string
  lastLogin: string
  totalSpent: number
  amount?: string
}

export const customersColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-blue-50"
      >
        <Mail className="mr-2 h-4 w-4 text-blue-600" />
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-indigo-50"
      >
        <User className="mr-2 h-4 w-4 text-indigo-600" />
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-purple-50"
      >
        Plan
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <Badge variant="outline">{row.getValue("plan") as string}</Badge>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-emerald-50"
      >
        <Activity className="mr-2 h-4 w-4 text-emerald-600" />
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || "unknown"
      const variant: "default" | "secondary" | "destructive" =
        status === "active" ? "default" : status === "trial" ? "secondary" : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "signupDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-orange-50"
      >
        <Calendar className="mr-2 h-4 w-4 text-orange-600" />
        Signup Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "lastLogin",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-yellow-50"
      >
        Last Login
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
 
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as string | undefined;
      return <div className="font-semibold text-gray-800">{amount || "—"}</div>;
    },
  },
]


