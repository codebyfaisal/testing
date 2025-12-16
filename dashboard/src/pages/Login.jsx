import React, { useState } from "react";
import useDashboardStore from "../store/useDashboardStore";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "../components";
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const { login, isLoading, error } = useDashboardStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-zinc-400 mb-6">Sign in to manage your portfolio.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            placeholder="admin@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            placeholder="••••••••"
          />

          <Button
            type="submit"
            uiType="primary"
            disabled={isLoading}
            loading={isLoading}
            icon={<FaSignInAlt size={12} />}
            label={isLoading ? "Signing in..." : "Sign In"}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
