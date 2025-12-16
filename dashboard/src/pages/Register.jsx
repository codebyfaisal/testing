import React, { useState } from "react";
import useDashboardStore from "../store/useDashboardStore";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "../components";
import { FaSignInAlt } from "react-icons/fa";

const Register = () => {
  const { register, isLoading, error } = useDashboardStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: { first: "", last: "" },
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">
          Setup Admin Account
        </h1>
        <p className="text-zinc-400 mb-6">
          Create the owner account for this portfolio.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <Input
            label="First Name *"
            name="first"
            value={formData.name.first}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: { ...prev.name, first: e.target.value },
              }))
            }
            required
            placeholder="John"
            className="col-span-1"
          />
          <Input
            label="Last Name"
            value={formData.name.last}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: { ...prev.name, last: e.target.value },
              }))
            }
            placeholder="Doe"
            className="col-span-1"
          />
          <Input
            label="Username *"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
            placeholder="johndoe"
            className="col-span-2"
          />
          <Input
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            placeholder="admin@example.com"
            className="col-span-2"
          />
          <Input
            label="Password *"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            placeholder="••••••••"
            className="col-span-2"
          />

          <Button
            uiType="primary"
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            className="col-span-2"
            icon={<FaSignInAlt size={12} />}
            label={isLoading ? "Creating Account..." : "Create Account"}
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
