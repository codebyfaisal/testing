import React from "react";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-zinc-400">{message}</p>
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel || onClose} uiType="text" label={cancelText} />
          <Button
            onClick={onConfirm}
            uiType={isDangerous ? "danger" : "primary"}
            label={confirmText}
            className={
              isDangerous ? "bg-red-500 hover:bg-red-600 text-white" : ""
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
