import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { FaTrash, FaEnvelope, FaCalendar, FaUser } from "react-icons/fa";
import {
  PageHeader,
  Button,
  ConfirmationModal,
  NotFound,
  SubscriberSkeleton,
  Card,
} from "@/components";

import toast from "react-hot-toast";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchSubscribers = async () => {
    try {
      const { data } = await axios.get("/subscribers");
      setSubscribers(data.data);
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/subscribers/${deleteId}`);
      toast.success("Subscriber deleted successfully");
      fetchSubscribers();
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete subscriber", error);
      toast.error("Failed to delete subscriber");
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Subscribers"
        description="Manage your newsletter subscribers."
      />

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {loading ? (
          <SubscriberSkeleton />
        ) : subscribers.length === 0 ? (
          <NotFound Icon={FaEnvelope} message="No subscribers yet." />
        ) : (
          <Card className="overflow-x-auto" padding="p-0">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-medium border-b border-border sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4 hidden md:table-cell">
                    Subscribed On
                  </th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subscribers.map((sub) => (
                  <tr
                    key={sub._id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          <FaUser size={12} />
                        </div>
                        <span className="font-medium text-foreground">
                          {sub.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FaCalendar size={12} />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          sub.isSubscribed
                            ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10"
                            : "text-destructive border-destructive/20 bg-destructive/10"
                        }`}
                      >
                        {sub.isSubscribed ? "Subscribed" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        onClick={() => setDeleteId(sub._id)}
                        uiType="text"
                        className="p-2! text-muted-foreground hover:text-destructive transition-colors"
                        icon={<FaTrash size={14} />}
                        title="Delete"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Subscriber?"
        message="Are you sure you want to remove this subscriber? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Subscribers;
