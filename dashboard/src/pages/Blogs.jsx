import React, { useEffect, useState } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { FaPlus } from "react-icons/fa";
import {
  Button,
  PageHeader,
  BlogSkeleton,
  BlogList,
  BlogForm,
} from "@/components";

const Blogs = () => {
  const { fetchPosts, posts, isLoading } = useDashboardStore();
  const [view, setView] = useState("list");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreate = () => {
    setSelectedPost(null);
    setView("create");
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setView("edit");
  };

  const handleSuccess = () => {
    fetchPosts();
    setView("list");
  };

  if (view === "create" || view === "edit") {
    return (
      <BlogForm
        post={selectedPost}
        onCancel={() => setView("list")}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
      <PageHeader
        title="Blog Posts"
        description="Manage your articles and publications."
      >
        <Button
          onClick={handleCreate}
          uiType="primary"
          label="Write New Article"
          icon={<FaPlus />}
        />
      </PageHeader>

      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {isLoading ? (
          <BlogSkeleton />
        ) : (
          <BlogList onEdit={handleEdit} onView={() => {}} />
        )}
      </div>
    </div>
  );
};

export default Blogs;
