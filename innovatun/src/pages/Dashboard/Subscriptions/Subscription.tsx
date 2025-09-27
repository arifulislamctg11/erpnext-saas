
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../contexts/use-auth";
import { api } from "../../../api";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { SubscriptionTable } from "../../../components/ui/table/subscription-table";
import type { Subscription } from "../../../components/ui/table/columns/subscription-columns";

export default function Subscription() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLocalSubscriptions = useCallback(() => {
    try {
      const localSubscriptions = JSON.parse(localStorage.getItem('localSubscriptions') || '[]');
      const userSubscriptions = localSubscriptions.filter((sub: Subscription) => sub.email === user?.email);
      setSubscriptions(userSubscriptions);
      
      if (userSubscriptions.length > 0) {
        toast.info("Showing locally stored subscriptions (server unavailable)");
      }
    } catch (error) {
      console.error("Error loading local subscriptions:", error);
      setSubscriptions([]);
    }
  }, [user]);

  const fetchSubscriptions = useCallback(async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(`${api.baseUrl}${api.subscriptions}/${user.email}`);
      const data = await response.json();

      if (data.success) {
        setSubscriptions(data.subscriptions);
      } else {
        toast.error("Failed to fetch subscriptions from server");
        // Fallback to local storage
        loadLocalSubscriptions();
      }
    } catch (error) {
      console.error("Error fetching subscriptions (CORS/Network issue):", error);
      // Fallback to local storage
      loadLocalSubscriptions();
    } finally {
      setLoading(false);
    }
  }, [user, loadLocalSubscriptions]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Subscriptions</h1>
          <Button onClick={fetchSubscriptions} variant="outline">
            Refresh
          </Button>
        </div>

        {subscriptions.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium mb-2">No subscriptions found</h3>
              <p className="text-sm">You haven't subscribed to any plans yet.</p>
            </div>
          </Card>
        ) : (
          <SubscriptionTable data={subscriptions} isLoading={loading} />
        )}
      </div>
    </div>
  );
}
