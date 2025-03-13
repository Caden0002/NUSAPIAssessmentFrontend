import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/dashboard", {
        Username: username,
        UserPassword: password,
      });

      localStorage.setItem("token", response.data.token);
      setError("");
      navigate("/flights"); // redirect after login
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-700">
          <p className="font-semibold mb-1">🧪 Test Users:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Admin:</strong> <code>admin1</code> /{" "}
              <code>password</code>
            </li>
            <li>
              <strong>User:</strong> <code>alice</code> / <code>password</code>
            </li>
            <li>
              <strong>User:</strong> <code>bob</code> / <code>password</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
