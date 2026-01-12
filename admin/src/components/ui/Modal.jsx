import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Button, Card } from "@/components";
import { cn } from "@/utils/cn";

const Modal = ({ isOpen, onClose, title, small = false, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <Card
          className={cn(
            "w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl",
            small ? "max-w-md" : "max-w-3xl"
          )}
          padding="p-0"
        >
          <div className="flex justify-between items-center border-b border-border sticky top-0 z-10">
            <h2 className="text-xl font-bold text-foreground px-6 py-4 capitalize">
              {title}
            </h2>
            <Button
              onClick={onClose}
              uiType="text"
              icon={<FaTimes size={12} />}
              label="Close"
              className="mr-4"
            />
          </div>
          <div className="px-6 py-4">{children}</div>
        </Card>
      </div>
    </>
  );
};

export default Modal;
