import React, { useState } from "react";
import { FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import useDashboardStore from "@/store/useDashboardStore";
import { Card } from "@/components";

const BlogList = ({ onEdit, onView }) => {
  const { posts, deletePost } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
    }
  };

  return (
    <Card className="overflow-hidden" padding="p-0">
      <div className="p-4 border-b border-border flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 text-xs uppercase font-medium text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Views</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr key={post._id} className="hover:bg-muted/30 transition">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {post.title}
                  </td>
                  <td className="px-6 py-4">{post.views}</td>
                  <td className="px-6 py-4">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() =>
                        window.open(
                          `${
                            import.meta.env.VITE_CLIENT_URL ||
                            "http://localhost:5173"
                          }/blogs/${post.slug}`,
                          "_blank"
                        )
                      }
                      className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                      title="View Live"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => onEdit(post)}
                      className="p-2 hover:bg-muted rounded-lg text-primary hover:text-primary/80 transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 hover:bg-muted rounded-lg text-destructive hover:text-destructive/80 transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No articles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default BlogList;
