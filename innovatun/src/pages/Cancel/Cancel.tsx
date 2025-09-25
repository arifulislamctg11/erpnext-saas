import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CancelPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: "Payment Cancelled ❌",
      text: "Your payment was not completed. Please try again.",
      icon: "error",
      confirmButtonText: "Back to Checkout",
    }).then(() => {
      navigate("/checkout");
    });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <h1 className="text-2xl font-bold text-red-600">Redirecting...</h1>
    </div>
  );
};

export default CancelPage;
