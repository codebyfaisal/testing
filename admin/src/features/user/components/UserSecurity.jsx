import React, { useState } from "react";

import { FaLock } from "react-icons/fa";
import { Input, Button, Modal, Card } from "@/components";
import useDashboardStore from "@/store/useDashboardStore";
import toast from "react-hot-toast";

const UserSecurity = () => {
  const { changePassword, isLoading } = useDashboardStore();
  const [newPassword, setNewPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({
    oldPassword: "",
    confirmNewPassword: "",
  });

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!newPassword) return;
    setIsModalOpen(true);
  };

  const handleConfirmUpdate = async (e) => {
    e.preventDefault();
    const { oldPassword, confirmNewPassword } = confirmData;
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (!oldPassword) {
      toast.error("Current password is required");
      return;
    }

    if (newPassword === oldPassword) {
      toast("New password cannot be the same as the old password", {
        style: {
          border: "1px solid #FFC107",
        },
        icon: "⚠️",
      });
      return;
    }

    try {
      await changePassword({
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
      toast.success("Password updated successfully");
      setIsModalOpen(false);
      setNewPassword("");
      setConfirmData({ oldPassword: "", confirmNewPassword: "" });
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    }
  };

  return (
    <>
      <Card className="ring ring-inset ring-yellow-700">
        <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
          <FaLock className="text-primary" /> Security
        </h3>
        <form
          className="grid grid-cols-1 sm:grid-cols-10 gap-4 items-end"
          onSubmit={handleInitialSubmit}
        >
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="sm:col-span-7 md:col-span-6 lg:col-span-7 xl:col-span-8"
          />

          <Button
            type="submit"
            label="Update Password"
            className="whitespace-nowrap sm:col-span-3 md:col-span-4 lg:col-span-3 xl:col-span-2 mb-px p-3"
            disabled={!newPassword}
            onClick={handleInitialSubmit}
          />
        </form>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Password Update"
      >
        <form className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={confirmData.oldPassword}
            onChange={(e) =>
              setConfirmData((prev) => ({
                ...prev,
                oldPassword: e.target.value,
              }))
            }
            placeholder="Enter current password"
            autoFocus
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmData.confirmNewPassword}
            onChange={(e) =>
              setConfirmData((prev) => ({
                ...prev,
                confirmNewPassword: e.target.value,
              }))
            }
            placeholder="Re-enter new password"
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              label="Cancel"
              uiType="text"
              onClick={() => setIsModalOpen(false)}
            />
            <Button
              label={isLoading ? "Updating..." : "Confirm Update"}
              uiType="primary"
              type="submit"
              onClick={handleConfirmUpdate}
              isLoading={isLoading}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UserSecurity;
