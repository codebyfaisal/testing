import React, { useState, Suspense } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaTrash } from "react-icons/fa";
import {
  Button,
  ConfirmationModal,
  Modal,
  PageHeader,
  MessageSkeleton,
  MessageList,
} from "@/components";
import toast from "react-hot-toast";

const Messages = () => {
  const { markMessageRead, deleteMessage } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null,
    id: null,
  });

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    if (message.status === "unread") {
      try {
        await markMessageRead(message._id);
        toast.success("Message marked as read");
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      toast.success("Message marked as read");
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleDelete = (_id) => {
    setConfirmState({
      isOpen: true,
      type: "delete",
      id: _id,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMessage(confirmState.id);
      toast.success("Message deleted successfully!");
      if (selectedMessage && selectedMessage._id === confirmState.id) {
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error(error.message || "Failed to delete message.");
    } finally {
      setConfirmState({ isOpen: false, type: null, id: null });
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Messages"
        description="View and manage your incoming messages."
      />

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <Suspense fallback={<MessageSkeleton />}>
          <MessageList
            onView={handleViewMessage}
            onDelete={handleDelete}
            onMarkRead={handleMarkRead}
          />
        </Suspense>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedMessage ? selectedMessage.subject : "View Message"}
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div className="space-y-1">
                <p className="">
                  From:{" "}
                  <span className="text-sm text-primary font-semibold">
                    {selectedMessage.from}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Email: {selectedMessage.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Type:{" "}
                  <span className="text-foreground">
                    {selectedMessage.type || "General"}
                  </span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(selectedMessage.date).toLocaleString()}
              </span>
            </div>

            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {selectedMessage.message || "No message content."}
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border">
              <Button onClick={handleCloseModal} uiType="text" label="Close" />
              <Button
                onClick={() => handleDelete(selectedMessage._id)}
                uiType="danger"
                icon={<FaTrash size={12} />}
                label="Delete"
              />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, type: null, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Message?"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Messages;
