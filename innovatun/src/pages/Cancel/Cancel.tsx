import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CancelPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error("Payment Cancelled ❌", {
      description: "Your payment was not completed. Please try again.",
      action: {
        label: "Back to Checkout",
        onClick: () => navigate("/checkout"),
      },
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Cancel icon */}
          <div className="relative z-10 mb-6">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="text-4xl mb-2">😔</div>
          </div>

          {/* Cancel message */}
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your payment was not completed. Don't worry, you can try again anytime!
            </p>

            {/* Action card */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-center space-x-2">
                <div className="text-left">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-red-600">Payment Cancelled</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/home")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Back to Pricing
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Go to Dashboard
              </button>
            </div>

            {/* Redirect message */}
            <div className="mt-6 flex items-center justify-center space-x-2 text-gray-500">
              <div className="animate-pulse w-2 h-2 bg-red-400 rounded-full"></div>
              <p className="text-sm">You can try again when you're ready</p>
            </div>
          </div>
        </div>

        {/* Additional info card */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team for assistance with your subscription.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
