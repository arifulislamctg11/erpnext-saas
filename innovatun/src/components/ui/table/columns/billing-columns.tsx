import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../../badge"
import { Button } from "../../button"
import { ArrowUpDown, Calendar, DollarSign, CreditCard, Clock, Receipt, Download } from "lucide-react"
import { PDFGenerator, type InvoiceData, type ReceiptData } from "../../../../utils/pdf-generator"

export interface BillingRecord {
  _id: string
  userId: string
  email: string
  planName: string
  amount: string
  currency: string
  sessionId: string
  status: string
  subscriptionId: string
  currentPeriodStart: string
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
  // Billing specific fields
  billingPeriod: string
  nextBillingDate: string
  totalPaid: string
  paymentMethod: string
}

export const getBillingStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'expired':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'past_due':
      return 'bg-orange-100 text-orange-800 border-orange-200'
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

export const calculateNextBillingDate = (currentPeriodEnd: string) => {
  const endDate = new Date(currentPeriodEnd)
  const nextBilling = new Date(endDate.getTime() + 24 * 60 * 60 * 1000) // Next day
  return nextBilling.toISOString()
}

export const calculateTotalPaid = (amount: string, createdAt: string, currentPeriodEnd: string) => {
  const numericAmount = parseFloat(amount.replace(/[^0-9.,]/g, '').replace(',', ''))
  const startDate = new Date(createdAt)
  const endDate = new Date(currentPeriodEnd)
  const monthsDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  return `$${(numericAmount * Math.max(1, monthsDiff)).toLocaleString()}`
}

export const billingColumns: ColumnDef<BillingRecord>[] = [
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
          Plan
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
    accessorKey: "totalPaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-purple-50"
        >
          <Receipt className="mr-2 h-4 w-4 text-purple-600" />
          Total Paid
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const totalPaid = row.getValue("totalPaid") as string
      return (
        <div className="flex items-center space-x-2">
          <Receipt className="h-4 w-4 text-purple-500" />
          <div className="font-semibold text-purple-700">{totalPaid}</div>
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
          <Badge className={`${getBillingStatusColor(status)} border font-semibold px-3 py-1`}>
            {status}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "nextBillingDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-orange-50"
        >
          <Clock className="mr-2 h-4 w-4 text-orange-600" />
          Next Billing
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("nextBillingDate") as string
      return (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-orange-500" />
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
          className="h-8 px-2 lg:px-3 font-semibold text-gray-700 hover:bg-indigo-50"
        >
          <Calendar className="mr-2 h-4 w-4 text-indigo-600" />
          Period End
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("currentPeriodEnd") as string
      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <div className="text-sm font-medium text-gray-700">{formatDate(date)}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const paymentMethod = row.getValue("paymentMethod") as string
      return (
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-gray-500" />
          <div className="text-sm font-medium text-gray-700">{paymentMethod}</div>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const billingRecord = row.original

      const handleDownloadInvoice = () => {
        const invoiceData: InvoiceData = {
          invoiceNumber: `INV-${billingRecord.sessionId.substring(0, 8).toUpperCase()}`,
          invoiceDate: formatDate(billingRecord.createdAt),
          dueDate: formatDate(billingRecord.currentPeriodEnd),
          customerName: billingRecord.email.split('@')[0],
          customerEmail: billingRecord.email,
          companyName: 'Your Company',
          planName: billingRecord.planName,
          amount: billingRecord.amount,
          currency: billingRecord.currency,
          billingPeriod: billingRecord.billingPeriod,
          status: billingRecord.status,
          sessionId: billingRecord.sessionId
        }
        PDFGenerator.generateInvoice(invoiceData)
      }

      const handleDownloadReceipt = () => {
        const receiptData: ReceiptData = {
          receiptNumber: `RCP-${billingRecord.sessionId.substring(0, 8).toUpperCase()}`,
          receiptDate: formatDate(billingRecord.createdAt),
          customerName: billingRecord.email.split('@')[0],
          customerEmail: billingRecord.email,
          planName: billingRecord.planName,
          amount: billingRecord.amount,
          currency: billingRecord.currency,
          paymentMethod: billingRecord.paymentMethod,
          sessionId: billingRecord.sessionId,
          status: billingRecord.status
        }
        PDFGenerator.generateReceipt(receiptData)
      }

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs hover:bg-blue-50"
            onClick={handleDownloadInvoice}
          >
            <Download className="h-3 w-3 mr-1" />
            Invoice
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs hover:bg-green-50"
            onClick={handleDownloadReceipt}
          >
            <Receipt className="h-3 w-3 mr-1" />
            Receipt
          </Button>
        </div>
      )
    },
  },
]
