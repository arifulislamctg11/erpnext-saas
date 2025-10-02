
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../contexts/use-auth";
import { api } from "../../../api";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
import { BillingTable } from "../../../components/ui/table/billing-table";
import type { BillingRecord } from "../../../components/ui/table/columns/billing-columns";
import type { Subscription } from "../../../components/ui/table/columns/subscription-columns";
import { calculateNextBillingDate, calculateTotalPaid, formatDate } from "../../../components/ui/table/columns/billing-columns";
import { PDFGenerator, type InvoiceData } from "../../../utils/pdf-generator";

export default function Billing() {
  const { user } = useAuth();
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLocalBilling = useCallback(() => {
    try {
      const localSubscriptions = JSON.parse(localStorage.getItem('localSubscriptions') || '[]');
      const userSubscriptions = localSubscriptions.filter((sub: Subscription) => sub.email === user?.email);
      
      // Transform subscription data to billing records
      const billingData = userSubscriptions.map((sub: Subscription): BillingRecord => ({
        ...sub,
        billingPeriod: `${sub.currentPeriodStart} - ${sub.currentPeriodEnd}`,
        nextBillingDate: calculateNextBillingDate(sub.currentPeriodEnd),
        totalPaid: calculateTotalPaid(sub.amount, sub.createdAt, sub.currentPeriodEnd),
        paymentMethod: 'Credit Card' // Default payment method
      }));
      
      setBillingRecords(billingData);
      
      if (userSubscriptions.length > 0) {
        toast.info("Showing locally stored billing data (server unavailable)");
      }
    } catch (error) {
      console.error("Error loading local billing data:", error);
      setBillingRecords([]);
    }
  }, [user]);

  const fetchBillingData = useCallback(async () => {
    if (!user?.email) return;

    try {
      const response = await fetch(`${api.baseUrl}${api.subscriptions}/${user.email}`);
      const data = await response.json();

      if (data.success) {
        // Transform subscription data to billing records
        const billingData = data.subscriptions.map((sub: Subscription): BillingRecord => ({
          ...sub,
          billingPeriod: `${sub.currentPeriodStart} - ${sub.currentPeriodEnd}`,
          nextBillingDate: calculateNextBillingDate(sub.currentPeriodEnd),
          totalPaid: calculateTotalPaid(sub.amount, sub.createdAt, sub.currentPeriodEnd),
          paymentMethod: 'Credit Card' // Default payment method
        }));
        
        setBillingRecords(billingData);
      } else {
        toast.error("Failed to fetch billing data from server");
        // Fallback to local storage
        loadLocalBilling();
      }
    } catch (error) {
      console.error("Error fetching billing data (CORS/Network issue):", error);
      // Fallback to local storage
      loadLocalBilling();
    } finally {
      setLoading(false);
    }
  }, [user, loadLocalBilling]);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  const handleDownloadAllInvoices = () => {
    if (billingRecords.length === 0) {
      toast.error("No billing records to download");
      return;
    }

    toast.loading("Generating invoices...", { id: "download-all" });
    
    // Generate invoices with a small delay between each to avoid browser blocking
    billingRecords.forEach((record, index) => {
      setTimeout(() => {
        const invoiceData: InvoiceData = {
          invoiceNumber: `INV-${record.sessionId.substring(0, 8).toUpperCase()}`,
          invoiceDate: formatDate(record.createdAt),
          dueDate: formatDate(record.currentPeriodEnd),
          customerName: record.email.split('@')[0],
          customerEmail: record.email,
          companyName: 'Your Company',
          planName: record.planName,
          amount: record.amount,
          currency: record.currency,
          billingPeriod: record.billingPeriod,
          status: record.status,
          sessionId: record.sessionId
        };
        PDFGenerator.generateInvoice(invoiceData);
        
        if (index === billingRecords.length - 1) {
          toast.dismiss("download-all");
          toast.success(`Downloaded ${billingRecords.length} invoices successfully!`);
        }
      }, index * 1000); // 1 second delay between each download
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <div className="flex space-x-3">
            <Button onClick={fetchBillingData} variant="outline">
              Refresh
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleDownloadAllInvoices}
            >
              Download All Invoices
            </Button>
          </div>
        </div>

        {billingRecords.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-lg font-medium mb-2">No billing records found</h3>
              <p className="text-sm">You don't have any billing history yet.</p>
            </div>
          </Card>
        ) : (
          <BillingTable data={billingRecords} isLoading={loading} />
        )}
      </div>
    </div>
  );
}
