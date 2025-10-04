import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { api } from "../../api";
import { ResetOTPUrl } from "../../api/Urls";
import { useAuth } from "../../contexts/use-auth";

type LocationState = { from?: { pathname?: string } } | null;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" , otp: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [susseccTxt, setSusseccTxt] = useState('');

  const fromPath = ((location.state as LocationState)?.from?.pathname) || "/dashboard";
  const { PasswordReset } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData) return;
    setIsLoading(true);
    setError(null);
    try {

       const response = await fetch(`${api.baseUrl}${ResetOTPUrl}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: formData.email, password: formData?.password, otp: formData.otp }),
        });
        const formatedRes = await response.json();
      
        if(formatedRes?.message !== "Password Changed successfully"){
          setError(formatedRes?.message);
          setIsLoading(true);
          return
        }
        else{
          setSusseccTxt('Password Changed successfully!')
          setTimeout(() => navigate('/login'), 1000)
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
      <div className="w-full max-w-5xl p-6 rounded-lg shadow-lg bg-white/90 backdrop-filter backdrop-blur-sm  my-13 ">
        {/* Left side: Form */}
        <div className="w-full lg:w-1/2 mx-auto p-4 lg:p-8">
            <p className="text-xl md:text-2xl font-bold mb-4 ">Reset Your Password</p>

          <form onSubmit={handleLogin} aria-label="Login form">
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
            
            <div className="mt-4">
              <p className="text-sm font-medium text-start">
                OTP
              </p>

              <input
                id="otp"
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleInputChange}
                className={inputClass}
                required
                aria-required="true"
              />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                 New Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={inputClass}
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-sm"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {
              susseccTxt ? <p className="font-medium text-green-500 text-lg">{susseccTxt}</p> :
              <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password || !formData.otp}
              className="w-[200px] py-3 mt-6 text-white transition-colors duration-300 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-70"
              aria-label="Sign in to your account"
            >
              {isLoading ? "Loading..." : "Submit"}
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


