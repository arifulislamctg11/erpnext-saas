import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    Swal.fire({
      title: "Payment Successful 🎉",
      text: "Thank you for your purchase!",
      icon: "success",
      confirmButtonText: "Go to Dashboard",
    }).then(() => {
      navigate("/dashboard");
    });
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-2xl font-bold text-green-600">Processing your order...</h1>
      {sessionId && (
        <p className="mt-2 text-gray-500">Session ID: {sessionId}</p>
      )}
    </div>
  );
};

export default SuccessPage;
