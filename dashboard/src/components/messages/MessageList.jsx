import React, { useEffect } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaTrash, FaEye, FaEnvelopeOpen, FaEnvelope } from "react-icons/fa";
import { Button, NotFound, Card } from "@/components";

const MessageList = ({ onView, onDelete, onMarkRead }) => {
  const { fetchMessages, messages, config, getConfig } = useDashboardStore();

  useEffect(() => {
    fetchMessages();
    if (!config?.messageTypes) getConfig();
  }, []);

  if (!messages || messages.length === 0) {
    return (
      <Card className="overflow-hidden flex justify-center">
        <NotFound Icon={FaEnvelope} message="No messages found." />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden" padding="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {messages.map((message, index) => (
              <tr
                key={message._id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      message.status === "unread"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {message.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border"
                    style={{
                      backgroundColor:
                        config?.messageTypes?.find(
                          (t) => t.type === message.type
                        )?.typeColor || "#27272a",
                    }}
                  >
                    {message?.type || "General"}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-foreground">
                  {message.from}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {message.subject}
                </td>
                <td className="px-6 py-4 text-muted-foreground text-sm">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default MessageList;
