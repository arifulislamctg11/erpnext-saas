import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/use-auth";
import { api } from "../../../api";



type LocationState = { from?: { pathname?: string } } | null;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signinWithEmail} = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fromPath = ((location.state as LocationState)?.from?.pathname) || "/dashboard";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const requestJwt = async (email: string) => {
    // Use live backend link (fallback already set in api.baseUrl)
    const endpoint = `${api.baseUrl}/jwt`;
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
  };

  const fetchUserProfile = async (email: string) => {
    try {
      const emailLower = email.toLowerCase();
      const endpoint = `${api.baseUrl}/users?email=${encodeURIComponent(emailLower)}`;
      const res = await fetch(endpoint);
      if (!res.ok) return null;
      const data = await res.json();
      return data as { email?: string; role?: string } | null;
    } catch {
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    setIsLoading(true);
    setError(null);
    try {
      await signinWithEmail(formData.email, formData.password);
      try {
        await requestJwt(formData.email);
      } catch (jwtErr) {
        
        console.warn("JWT request failed", jwtErr);
      }
      const profile = await fetchUserProfile(formData.email);
      const emailLower = formData.email.toLowerCase();
      const isBackendAdmin = profile?.role === "admin" && emailLower === "aljoboyer@gmail.com";
      navigate(isBackendAdmin ? "/admin" : fromPath);
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
    <div className="flex items-center justify-center min-h-screen bg-blue-50 text-gray-800">
      <div className="flex flex-col-reverse w-full max-w-5xl p-6 rounded-lg shadow-lg md:flex-row bg-white/90 backdrop-filter backdrop-blur-sm">
        {/* Left side: Form */}
        <div className="flex-1 p-4 lg:p-8">
          <h1 className="mb-6 text-3xl font-bold text-center text-black">Welcome Back</h1>

          <form onSubmit={handleLogin} aria-label="Login form">
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-start">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClass}
                required
                aria-required="true"
              />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-600 hover:underline focus:outline-none focus:underline"
                >
                  Forgot Password?
                </Link>
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

            <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full py-3 mt-6 text-white bg-black"
              aria-label="Sign in to your account"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {error && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {/* <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div> */}

            {/* <button
              type="button"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                setError(null);
                try {
                  const user = await signinWithGoogle();
                  try {
                    await requestJwt(user.email ?? "");
                  } catch (jwtErr) {
                    console.warn("JWT request failed", jwtErr);
                  }
                  const profile = await fetchUserProfile(user.email ?? "");
                  const emailLower = (user.email ?? "").toLowerCase();
                  const isBackendAdmin = profile?.role === "admin" && emailLower === "aljoboyer@gmail.com";
                  navigate(isBackendAdmin ? "/admin" : fromPath);
                } catch (err) {
                  const message = (err as { message?: string })?.message || "Google sign-in failed";
                  setError(message);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full py-3 mt-2 text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label="Sign in with Google"
            >
              Continue with Google
            </button> */}
          </form>

          <p className="mt-6 text-sm text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline focus:outline-none focus:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        <div className="items-center justify-center flex-1 hidden p-4 md:flex">
     
        </div>
      </div>
    </div>
  );
}


