import { Testimonial } from "../models/testimonial.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTestimonial = asyncHandler(async (req, res) => {
    const { name, role, text, avatar, hasVideo, videoType, videoUrl } = req.body;

    const testimonial = await Testimonial.create({
        name,
        role,
        text,
        avatar,
        hasVideo,
        videoType,
        videoUrl
    });

    return res.status(201).json(
        new ApiResponse(201, testimonial, "Testimonial created successfully")
    );
});

const getAllTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find();
    return res.status(200).json(
        new ApiResponse(200, testimonials, "Testimonials fetched successfully")
    );
});

const getTestimonialById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    return res.status(200).json(
        new ApiResponse(200, testimonial, "Testimonial fetched successfully")
    );
});

const updateTestimonial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, role, text, avatar, hasVideo, videoType, videoUrl } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        {
            $set: {
                name,
                role,
                text,
                avatar,
                hasVideo,
                videoType,
                videoUrl
            }
        },
        { new: true }
    );

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    return res.status(200).json(
        new ApiResponse(200, testimonial, "Testimonial updated successfully")
    );
});

const deleteTestimonial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Testimonial deleted successfully")
    );
});

export {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
};
