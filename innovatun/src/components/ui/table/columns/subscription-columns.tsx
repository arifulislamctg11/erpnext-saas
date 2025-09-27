import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../../badge"
import { Button } from "../../button"
import { ArrowUpDown, Calendar, DollarSign, CreditCard, Clock } from "lucide-react"

export interface Subscription {
  _id: string
  userId: string
  email: string
  planName: string
  priceId: string
  amount: string
  currency: string
  sessionId: string
  status: string
  subscriptionId: string
  currentPeriodStart: string
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'expired':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200'
  }
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatCurrency = (amount: string, currency: string = 'USD') => {
  // Extract numeric value from amount string like "$4,500 / month"
  const numericValue = amount.replace(/[^0-9.,]/g, '')
  if (numericValue) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(parseFloat(numericValue.replace(',', '')))
  }
  return amount
}

export const subscriptionColumns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "planName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-blue-50"
        >
          <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
          Plan Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <div className="font-semibold text-gray-800">{row.getValue("planName")}</div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-green-50"
        >
          <DollarSign className="mr-2 h-4 w-4 text-green-600" />
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = row.getValue("amount") as string
      return (
        <div className="flex items-center space-x-2">
          <div className="font-bold text-green-700 text-lg">{amount}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="flex items-center justify-center">
          <Badge className={`${getStatusColor(status)} border font-semibold px-3 py-1`}>
            {status}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "currentPeriodStart",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-purple-50"
        >
          <Calendar className="mr-2 h-4 w-4 text-purple-600" />
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("currentPeriodStart") as string
      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-purple-500" />
          <div className="text-sm font-medium text-gray-700">{formatDate(date)}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "currentPeriodEnd",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-orange-50"
        >
          <Clock className="mr-2 h-4 w-4 text-orange-600" />
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("currentPeriodEnd") as string
      return (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-orange-500" />
          <div className="text-sm font-medium text-gray-700">{formatDate(date)}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "sessionId",
    header: "Session ID",
    cell: ({ row }) => {
      const sessionId = row.getValue("sessionId") as string
      return (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
            <CreditCard className="h-3 w-3 text-gray-500" />
          </div>
          <div className="font-mono text-xs text-gray-500 max-w-[120px] truncate bg-gray-50 px-2 py-1 rounded">
            {sessionId}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-indigo-50"
        >
          <Calendar className="mr-2 h-4 w-4 text-indigo-600" />
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          <div className="text-sm text-gray-600">{formatDate(date)}</div>
        </div>
      )
    },
  },
]