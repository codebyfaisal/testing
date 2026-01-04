import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { Link } from "react-router-dom";
import { FaCalendar, FaArrowRight, FaSearch } from "react-icons/fa";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";
import { PageHeader, SEO, CardSkeleton, NotFound } from "@/components";
import { siteConfig } from "@/config/siteConfig";

const Blogs = () => {
  const { rounded } = usePortfolioStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { header, seo, notFound } = siteConfig?.pages?.blogs;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/posts/public");
        setPosts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <SEO
        title={seo?.title}
        description={seo?.description}
        keywords={seo?.keywords}
      />

      <div className="flex flex-col items-center justify-center lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-4 mb-4 lg:mb-16">
        <PageHeader
          title={{
            start: header?.title?.start,
            middle: header?.title?.middle,
          }}
          description={header?.description}
          className="sm:max-w-md text-center lg:text-left my-0 sm:mx-0"
        />

        <div className="relative w-full md:max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full bg-card/50 border border-border pl-12 pr-6 py-3 text-foreground focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground",
              rounded
            )}
          />
        </div>
      </div>

      {loading ? (
        <CardSkeleton count={6} />
      ) : filteredPosts.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              to={`/blogs/${post.slug}`}
              key={post._id}
              className={cn(
                "group overflow-hidden border border-border hover:border-secondary hover:bg-secondary/5 transition-all duration-300 flex flex-col bg-card",
                rounded
              )}
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className={cn(
                      "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
                      rounded
                    )}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                    No Image
                  </div>
                )}
                <div
                  className={cn(
                    "absolute top-4 right-4 bg-background/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-foreground flex items-center gap-2",
                    rounded
                  )}
                >
                  <FaCalendar size={10} />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className={cn("p-6 flex-1 flex flex-col", rounded)}>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                  {post.excerpt || "Click to read more..."}
                </p>

                <div className="mt-auto flex items-center text-secondary text-sm font-medium gap-1">
                  Read Article{" "}
                  <FaArrowRight className="ml-1 transition-all duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <NotFound
          title={notFound?.title}
          description={notFound?.description}
          isFullPage={false}
          backgroundText="EMPTY"
          link="/contact"
          backTo="Contact Me"
          showBackgroundBubbles={false}
          className="my-10"
          rounded={rounded}
        />
      )}
    </>
  );
};

export default Blogs;
