import { DataTable } from "./data-table"
import { subscriptionColumns, type Subscription } from "./subscription-table-columns"

interface SubscriptionTableProps {
  data: Subscription[]
  isLoading?: boolean
}

export function SubscriptionTable({ data, isLoading = false }: SubscriptionTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DataTable 
      columns={subscriptionColumns} 
      data={data} 
      searchKey="planName"
      searchPlaceholder="Search subscriptions..."
    />
  )
}
