import React, { useEffect, useState, useMemo } from "react";
import axios from "@/api/axios";
import {
  FaTrash,
  FaEnvelope,
  FaFilter,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import {
  PageHeader,
  Button,
  ConfirmationModal,
  NotFound,
  SubscriberSkeleton,
  Card,
  RightSidebar,
  Input,
  Select,
  FadeIn,
} from "@/components";

import toast from "react-hot-toast";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

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

  // Filter Logic
  const filteredSubscribers = useMemo(() => {
    if (!subscribers) return [];
    return subscribers.filter((sub) => {
      const matchesSearch = sub.email
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

      const isSubscribed = sub.isSubscribed;
      const matchesStatus =
        filters.status === "" ||
        (filters.status === "subscribed" && isSubscribed) ||
        (filters.status === "unsubscribed" && !isSubscribed);

      return matchesSearch && matchesStatus;
    });
  }, [subscribers, filters]);

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
        children={
          <Button
            onClick={() => setShowFilters(true)}
            uiType="secondary"
            icon={<FaFilter />}
            label="Filters"
          />
        }
      />

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        <FadeIn className="h-full">
          {!subscribers || subscribers.length === 0 ? (
            <div className="flex justify-center h-full items-center">
              <NotFound Icon={FaEnvelope} message="No subscribers found." />
            </div>
          ) : !filteredSubscribers || filteredSubscribers.length === 0 ? (
            <div className="flex justify-center h-full items-center">
              <NotFound
                Icon={FaSearch}
                message="No subscribers found matching your criteria."
              />
            </div>
          ) : (
            <Card className="overflow-hidden p-0 border-border">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_120px_120px_80px] gap-4 bg-muted/50 text-muted-foreground uppercase font-medium text-xs px-6 py-3 border-b border-border">
                    <div className="flex items-center">Email</div>
                    <div className="flex items-center">Status</div>
                    <div className="flex items-center">Date</div>
                    <div className="flex items-center justify-end">Actions</div>
                  </div>

                  {/* Body */}
                  <div className="divide-y divide-border">
                    {loading ? (
                      <SubscriberSkeleton />
                    ) : (
                      filteredSubscribers.map((sub) => (
                        <div
                          key={sub._id}
                          className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-6 py-4 hover:bg-muted/50 transition-colors items-center"
                        >
                          <div className="font-medium text-foreground truncate">
                            {sub.email}
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                sub.isSubscribed
                                  ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
                                  : "text-destructive border-destructive/20 bg-destructive/10"
                              }`}
                            >
                              {sub.isSubscribed ? "Subscribed" : "Unsubscribed"}
                            </span>
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-right">
                            <Button
                              onClick={() => setDeleteId(sub._id)}
                              uiType="action"
                              icon={<FaTrash />}
                              title="Delete"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </FadeIn>
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

      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Subscribers"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={() => setFilters({ search: "", status: "" })}
              label="Reset"
              uiType="secondary"
              className="w-full"
              icon={<FaTimes />}
            />
            <Button
              onClick={() => setShowFilters(false)}
              label="Done"
              uiType="primary"
              className="w-full"
            />
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Search Email"
            placeholder="Search by email..."
            icon={<FaSearch />}
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            options={[
              { value: "", label: "All Statuses" },
              { value: "subscribed", label: "Subscribed" },
              { value: "unsubscribed", label: "Unsubscribed" },
            ]}
          />

          <div className="text-xs text-muted-foreground">
            <p>
              Filtering {filteredSubscribers.length} of{" "}
              {subscribers?.length || 0} subscribers
            </p>
          </div>
        </div>
      </RightSidebar>
    </div>
  );
};

export default Subscribers;
