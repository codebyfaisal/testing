import React from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Card, BlogSkeleton, Button } from "@/components";

const BlogList = ({ posts, isLoading, onEdit, onDelete, onView }) => {
  return (
    <Card className="overflow-hidden p-0 border-border">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[1fr_100px_120px_120px] gap-4 bg-muted/50 text-muted-foreground uppercase font-medium text-xs px-6 py-3 border-b border-border">
            <div className="flex items-center">Title</div>
            <div className="flex items-center">Views</div>
            <div className="flex items-center">Created</div>
            <div className="flex items-center justify-end">Actions</div>
          </div>

          {/* Body */}
          <div className="divide-y divide-border">
            {isLoading ? (
              <BlogSkeleton />
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="grid grid-cols-[1fr_100px_120px_120px] gap-4 px-6 py-4 hover:bg-muted/30 transition-colors items-center"
                >
                  <div className="font-medium text-foreground truncate">
                    {post.title}
                  </div>
                  <div className="text-muted-foreground">{post.views}</div>
                  <div className="text-muted-foreground text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() =>
                        window.open(
                          `${
                            import.meta.env.VITE_CLIENT_URL ||
                            "http://localhost:5173"
                          }/blogs/${post.slug}`,
                          "_blank"
                        )
                      }
                      uiType="action"
                      icon={<FaEye />}
                      title="View Live"
                    />
                    <Button
                      onClick={() => onEdit(post)}
                      uiType="action"
                      icon={<FaEdit />}
                      title="Edit"
                    />
                    <Button
                      onClick={() => onDelete(post._id)}
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
  );
};

export default BlogList;
