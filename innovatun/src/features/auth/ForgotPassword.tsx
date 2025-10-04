import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { api } from "../../api";
import { SendOTPUrl } from "../../api/Urls";
import { useAuth } from "../../contexts/use-auth";

type LocationState = { from?: { pathname?: string } } | null;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [susseccTxt, setSusseccTxt] = useState('');
   const { PasswordReset } = useAuth();
  const fromPath = ((location.state as LocationState)?.from?.pathname) || "/dashboard";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setIsLoading(true);
    setError(null);
    try {
        const otp_send_res = await fetch(`${api.baseUrl}${SendOTPUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: formData.email }),
      });
      const formatedRes = await otp_send_res.json();
    
      if(formatedRes?.message == "User not registered with this email"){
        setError(formatedRes?.message);
        setIsLoading(true);
        return
      }
      else{
        const resetRes = await PasswordReset(formData.email);
   
        if(resetRes?.success && resetRes){
          setSusseccTxt('An email has been sent. Please check your inbox or spam folder.')
          setIsLoading(false);
          setError(null);
          setTimeout(() => {
            setSusseccTxt('');
            navigate('/login')
          }, 5000)
        }else{
          setIsLoading(false);
          setError('Failed to send email. Please enter registerd email');
        }
      }
      
    } catch (err) {
      const message = (err as { message?: string })?.message || "Failed to sign in";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-white border-gray-300";

  return (
    <div className="flex  justify-center bg-blue-50 text-gray-800">
      <div className=" w-full max-w-5xl p-6 rounded-lg shadow-lg  bg-white/90 backdrop-filter backdrop-blur-sm  my-13 ">
        {/* Left side: Form */}
        <div className="w-full lg:w-1/2 mx-auto p-4 lg:p-8">
            <p className="text-xl md:text-2xl font-bold mb-4">Enter Your Registered Email Address</p>
            <p className="text-sm font-medium text-gray-500 mb-4 ">We will send an email with Reset Password link to your email</p>

          <form onSubmit={handleSendOtp} aria-label="Login form">
            <div className="mt-4">
              <p className="text-sm font-medium text-start">
                Email
              </p>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter Your Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClass}
                required
                aria-required="true"
              />
            </div>
            {
              susseccTxt ? <p className="font-medium text-green-500 text-lg">{susseccTxt}</p> :  <button
              type="submit"
              disabled={isLoading || !formData.email}
              className="w-[200px] py-3 mt-6 text-white transition-colors duration-300 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-70 cursor-pointer"
              aria-label="Sign in to your account"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
            }
           

            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}


