import { Form } from "../models/form.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// @desc    Get all forms (public/admin)
// @route   GET /api/v1/forms
// @access  Public (for listing?) or Admin
const getForms = asyncHandler(async (req, res) => {
    const { isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }

    const forms = await Form.find(filter).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, forms, "Forms fetched successfully"));
});

// @desc    Get single form
// @route   GET /api/v1/forms/:id
// @access  Public
const getForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const form = await Form.findById(id);

    if (!form) {
        throw new ApiError(404, "Form not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, form, "Form fetched successfully"));
});

// @desc    Create a form
// @route   POST /api/v1/forms
// @access  Private (Admin)
const createForm = asyncHandler(async (req, res) => {
    const { title, description, questions, isActive, expiryDate } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    const form = await Form.create({
        title,
        description,
        questions: questions || [],
        isActive: isActive !== undefined ? isActive : true,
        expiryDate,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, form, "Form created successfully"));
});

// @desc    Update a form
// @route   PUT /api/v1/forms/:id
// @access  Private (Admin)
const updateForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const form = await Form.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!form) {
        throw new ApiError(404, "Form not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, form, "Form updated successfully"));
});

// @desc    Delete a form
// @route   DELETE /api/v1/forms/:id
// @access  Private (Admin)
const deleteForm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const form = await Form.findByIdAndDelete(id);

    if (!form) {
        throw new ApiError(404, "Form not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Form deleted successfully"));
});

export { getForms, getForm, createForm, updateForm, deleteForm };
