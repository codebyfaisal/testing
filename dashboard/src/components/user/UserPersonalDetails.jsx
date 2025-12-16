import React from "react";
import { motion } from "motion/react";
import { FaUser } from "react-icons/fa";
import { Input, Textarea } from "../../components";

const UserPersonalDetails = ({ formData, handleChange, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 ${className}`}
    >
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <FaUser className="text-indigo-500" /> Personal Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
        <Input
          label="First Name"
          name="name.first"
          value={formData.name.first}
          onChange={handleChange}
        />
        <Input
          label="Last Name"
          name="name.last"
          value={formData.name.last}
          onChange={handleChange}
        />
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <Textarea
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={8}
          className="col-span-full"
        />
      </div>
    </motion.div>
  );
};

export default UserPersonalDetails;
