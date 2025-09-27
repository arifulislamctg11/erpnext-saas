import { useEffect, useCallback, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../contexts/use-auth";
import { api } from "../../api";

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = searchParams.get("session_id");
  const planName = searchParams.get("plan_name");
  const planAmount = searchParams.get("plan_amount");
  const [planData, setPlanData] = useState({ 
    planName: planName || 'Your Plan', 
    amount: planAmount || 'Unknown Amount', 
    priceId: '' 
  });

  const storeSubscription = useCallback(async () => {
    if (!user?.email || !sessionId) return;

    try {
      // Use plan data from URL parameters (primary source)
      let planData = { 
        planName: planName || 'Unknown Plan', 
        amount: planAmount || 'Unknown Amount', 
        priceId: '' 
      };
      
      // Try to get additional data from backend if needed
      try {
        const sessionResponse = await fetch(`${api.baseUrl}/get-session-data/${sessionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          // Only update if we don't have URL data
          if (!planName || !planAmount) {
            planData = {
              planName: sessionData.planName || planName || 'Unknown Plan',
              amount: sessionData.planAmount || planAmount || 'Unknown Amount',
              priceId: sessionData.priceId || ''
            };
            setPlanData({
              planName: sessionData.planName || planName || 'Unknown Plan',
              amount: sessionData.planAmount || planAmount || 'Unknown Amount',
              priceId: sessionData.priceId || ''
            });
          }
        }
      } catch (sessionError) {
        console.error('Error fetching session data:', sessionError);
        // Keep the URL parameter data if backend fails
      }

      // Store subscription in MongoDB
      try {
        const response = await fetch(`${api.baseUrl}${api.subscriptions}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
            email: user.email,
            planName: planData.planName,
            priceId: planData.priceId,
            amount: planData.amount,
            currency: 'USD',
            sessionId: sessionId,
            status: 'active',
            subscriptionId: sessionId,
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }),
        });

        if (response.ok) {
          console.log('Subscription stored successfully in MongoDB');
        } else {
          console.error('Failed to store subscription in MongoDB');
        }
      } catch (fetchError) {
        console.error('Error storing subscription (CORS/Network issue):', fetchError);
        // Store locally as fallback
        const localSubscription = {
          userId: user.uid,
          email: user.email,
          planName: planData.planName,
          priceId: planData.priceId,
          amount: planData.amount,
          currency: 'USD',
          sessionId: sessionId,
          status: 'active',
          subscriptionId: sessionId,
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        };
        
        // Store in localStorage as fallback
        const existingSubscriptions = JSON.parse(localStorage.getItem('localSubscriptions') || '[]');
        existingSubscriptions.push(localSubscription);
        localStorage.setItem('localSubscriptions', JSON.stringify(existingSubscriptions));
        
        console.log('Subscription stored locally as fallback');
      }
    } catch (error) {
      console.error('Error storing subscription:', error);
    }
  }, [user, sessionId, planName, planAmount]);

  useEffect(() => {
    // Store subscription data
    storeSubscription();
    
    toast.success(`Payment Successful 🎉`, {
      description: `You have successfully subscribed to ${planData.planName}! Redirecting to dashboard...`,
    });
    
    // Navigate to dashboard after showing toast
    const timer = setTimeout(() => {
      navigate("/dashboard/subscriptions");
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate, user, storeSubscription, planData, planName, planAmount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Success icon */}
          <div className="relative z-10 mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-4xl mb-2">🎉</div>
          </div>

          {/* Success message */}
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You have successfully subscribed to <span className="font-semibold text-green-600">{planData.planName}</span>!
            </p>

            {/* Plan details card */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-semibold text-gray-800">{planData.planName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-800">{planData.amount}</p>
                </div>
              </div>
            </div>

            {/* Session ID */}
            {sessionId && (
              <div className="bg-blue-50 rounded-lg p-3 mb-6 border border-blue-200">
                <p className="text-xs text-blue-600 font-medium">Transaction ID</p>
                <p className="text-sm text-blue-800 font-mono break-all">{sessionId}</p>
              </div>
            )}

            {/* Redirect message */}
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-green-500"></div>
              <p className="text-sm">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>

        {/* Additional info card */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            Welcome to your new subscription! You can manage your account from the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
