import { DataTable } from "./components/data-table"
import { billingColumns, type BillingRecord } from "./columns/billing-columns"

interface BillingTableProps {
  data: BillingRecord[]
  isLoading?: boolean
}

export function BillingTable({ data, isLoading }: BillingTableProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <div className="text-gray-600 font-medium">Loading billing information...</div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate billing summary
  const totalAmount = data.reduce((sum, record) => {
    const numericAmount = parseFloat(record.amount.replace(/[^0-9.,]/g, '').replace(',', ''))
    return sum + numericAmount
  }, 0)

  const activeSubscriptions = data.filter(record => record.status.toLowerCase() === 'active').length
  const totalPaid = data.reduce((sum, record) => {
    const numericTotal = parseFloat(record.totalPaid.replace(/[^0-9.,]/g, '').replace(',', ''))
    return sum + numericTotal
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Billing Overview</h2>
            <p className="text-green-100">Manage your billing and payment history</p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
              <div className="text-green-100 text-sm">Monthly Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{activeSubscriptions}</div>
              <div className="text-green-100 text-sm">Active Plans</div>
            </div>
            <div>
              <div className="text-2xl font-bold">${totalPaid.toLocaleString()}</div>
              <div className="text-green-100 text-sm">Total Paid</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={billingColumns} data={data} searchKey="planName" />
    </div>
  )
}
