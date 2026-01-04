import Post from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};
    if (search) {
        query.title = { $regex: search, $options: "i" };
    }
    if (status) {
        query.isPublished = status === "published";
    }

    const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Post.countDocuments(query);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                posts,
                meta: {
                    total,
                    page: Number(page),
                    totalPages: Math.ceil(total / limit),
                },
            },
            "Posts fetched successfully"
        )
    );
});

const getPublicPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const query = {}; // No longer filtering by isPublished

    const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.status(200).json(
        new ApiResponse(200, posts, "Published posts fetched successfully")
    );
});

const getPostBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    // Increment views
    post.views += 1;
    await post.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, post, "Post details fetched"));
});

const createPost = asyncHandler(async (req, res) => {
    const { title, content, excerpt, coverImage, tags } = req.body;

    if (!title || !content) {
        throw new ApiError(400, "Title and Content are required");
    }

    const post = await Post.create({
        title,
        content,
        excerpt,
        coverImage,
        tags,
    });

    res
        .status(201)
        .json(new ApiResponse(201, post, "Post created successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, excerpt, coverImage, tags } = req.body;

    const post = await Post.findById(id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (coverImage) post.coverImage = coverImage;
    if (tags) post.tags = tags;

    await post.save();

    res
        .status(200)
        .json(new ApiResponse(200, post, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, null, "Post deleted successfully"));
});

export {
    getPosts,
    getPublicPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
};
