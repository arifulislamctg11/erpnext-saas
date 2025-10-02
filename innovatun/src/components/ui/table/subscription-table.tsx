import { DataTable } from "./components/data-table"
import { subscriptionColumns, type Subscription } from "./columns/subscription-columns"

interface SubscriptionTableProps {
  data: Subscription[]
  isLoading?: boolean
}

export function SubscriptionTable({ data, isLoading }: SubscriptionTableProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-gray-600 font-medium">Loading subscriptions...</div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate actual active plans count
  const activePlansCount = data.filter(subscription => 
    subscription.status.toLowerCase() === 'active'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Subscriptions</h2>
            <p className="text-blue-100">Manage and track your active subscriptions</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{activePlansCount}</div>
            <div className="text-blue-100 text-sm">Active Plans</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable columns={subscriptionColumns} data={data} searchKey="planName" />
    </div>
  )
}