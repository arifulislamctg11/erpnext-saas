import { useFrappeAuth } from "frappe-react-sdk";
import { useState } from "react";

const FrappeLogin = () => {
    const { login , logout, error , updateCurrentUser, isLoading } = useFrappeAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const handleLogin = () => {
    if (!username || !password) {
      setLoginError("Please fill in both fields.");
      return;
    }
    setLoginError(""); // Clear loginError
    console.log("Logging in with:", { username, password });
    // Add your login logic here
    login({username: username, password: password}).then((res) => {
        console.log("Login response:", res);
    }).catch((err) => {
        console.error("Login error:", err);
        setLoginError("Login failed. Please check your credentials.");
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {loginError && (
          <div className="text-red-500 text-sm mb-4 text-center">{loginError}</div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default FrappeLogin;