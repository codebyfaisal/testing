import { Job } from "../models/job.model.js";
import { Form } from "../models/form.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ status: "Open" }).sort({ createdAt: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
const getJob = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find job and populate its linked form
    const job = await Job.findById(id).populate("form");

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, job, "Job fetched successfully"));
});

// @desc    Create a job
// @route   POST /api/v1/jobs
// @access  Private (Admin)
const createJob = asyncHandler(async (req, res) => {
    const {
        title,
        type,
        location,
        description,
        requirements,
        salary,
        questions,
        lastDate,
    } = req.body;

    if (
        [title, type, location, description].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // 1. Create the Job first
    const job = await Job.create({
        title,
        type,
        location,
        description,
        requirements,
        salary,
        lastDate,
    });

    // 2. Create the associated Form for this Job
    const form = await Form.create({
        title: `Application for ${title}`,
        description: `Custom questions for ${title} application`,
        job: job._id,
        questions: questions || [],
        isActive: true,
    });

    // 3. Return response (form is linked via virtual)
    return res
        .status(201)
        .json(new ApiResponse(201, job, "Job created successfully"));
});

// @desc    Update a job
// @route   PUT /api/v1/jobs/:id
// @access  Private (Admin)
const updateJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { questions, ...jobData } = req.body;

    const job = await Job.findByIdAndUpdate(id, jobData, {
        new: true,
        runValidators: true,
    });

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // If questions are provided, update the linked form
    if (questions) {
        await Form.findOneAndUpdate(
            { job: id },
            {
                questions: questions,
                title: `Application for ${jobData.title || job.title}`,
            }
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, job, "Job updated successfully"));
});

// @desc    Delete a job
// @route   DELETE /api/v1/jobs/:id
// @access  Private (Admin)
const deleteJob = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // Also delete the associated form
    await Form.findOneAndDelete({ job: id });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Job deleted successfully"));
});

export { getJobs, getJob, createJob, updateJob, deleteJob };
