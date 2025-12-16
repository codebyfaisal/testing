import React, { useState, use, Suspense } from "react";
import useDashboardStore from "../store/useDashboardStore";
import { motion } from "motion/react";
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaEye } from "react-icons/fa";
import {
  Modal,
  Button,
  NotFound,
  ConfirmationModal,
  MessageSkeleton,
} from "../components";
import toast from "react-hot-toast";

const MessageList = ({ onView, onDelete, onMarkRead }) => {
  const { fetchMessages } = useDashboardStore();
  const messages = use(fetchMessages());

  if (!messages || messages.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-8 flex justify-center">
        <NotFound Icon={FaEnvelope} message="No messages found." />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {messages.map((message, index) => (
              <motion.tr
                key={message._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      message.status === "unread"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                    }`}
                  >
                    {message.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {message.type || "General"}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-white">
                  {message.from}
                </td>
                <td className="px-6 py-4 text-zinc-300">{message.subject}</td>
                <td className="px-6 py-4 text-zinc-400 text-sm">
                  {new Date(message.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <Button
                    onClick={() => onView(message)}
                    uiType="text"
                    icon={<FaEye size={12} />}
                    label="View"
                  />
                  {message.status === "unread" && (
                    <Button
                      onClick={() => onMarkRead(message._id)}
                      uiType="text"
                      icon={<FaEnvelopeOpen size={12} />}
                      label="Mark as Read"
                    />
                  )}
                  <Button
                    onClick={() => onDelete(message._id)}
                    uiType="danger"
                    icon={<FaTrash size={12} />}
                    label="Delete"
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Messages = () => {
  const { markMessageRead, deleteMessage } = useDashboardStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    type: null, // 'delete'
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
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-zinc-400">View and manage your incoming messages.</p>
      </header>

      <Suspense fallback={<MessageSkeleton />}>
        <MessageList
          onView={handleViewMessage}
          onDelete={handleDelete}
          onMarkRead={handleMarkRead}
        />
      </Suspense>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedMessage ? selectedMessage.subject : "View Message"}
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <p className="">
                  From:{" "}
                  <span className="text-sm text-indigo-400 font-semibold">
                    {selectedMessage.from}
                  </span>
                </p>
                <p className="text-xs text-zinc-400">
                  Email: {selectedMessage.email}
                </p>
                <p className="text-xs text-zinc-400">
                  Type:{" "}
                  <span className="text-zinc-300">
                    {selectedMessage.type || "General"}
                  </span>
                </p>
              </div>
              <span className="text-xs text-zinc-500">
                {new Date(selectedMessage.date).toLocaleString()}
              </span>
            </div>

            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {selectedMessage.message || "No message content."}
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
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
