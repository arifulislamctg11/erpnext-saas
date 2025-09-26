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
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-2xl font-bold text-red-600">Redirecting...</h1>
    </div>
  );
};

export default CancelPage;
