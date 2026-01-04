import React, { useState } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card } from "@/components";
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome Back
        </h1>
        <p className="text-muted-foreground mb-6">
          Sign in to manage your portfolio.
        </p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg mb-6 text-sm">
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
      </Card>
    </div>
  );
};

export default Login;
