import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Form } from "../models/form.model.js";
import { Applicant } from "../models/applicant.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// @desc    Submit a new application
// @route   POST /api/v1/applications
// @access  Public
const submitApplication = asyncHandler(async (req, res) => {
    const {
        jobId,
        formId,
        fullName,
        email,
        portfolioLink,
        resumeLink,
        coverLetter,
        answers
    } = req.body;

    // 1. Validation
    if (!jobId && !formId) {
        throw new ApiError(400, "Application must be linked to a Job or a Form");
    }

    if (!fullName || !email) {
        throw new ApiError(400, "Name and Email are required");
    }

    // 2. Job Validation (Optional but recommended)
    if (jobId) {
        const job = await Job.findById(jobId);
        if (!job || job.status !== "Open") {
            throw new ApiError(404, "Job not found or closed");
        }
    }

    // 3. Form Validation
    if (formId) {
        const form = await Form.findById(formId);
        if (!form || !form.isActive) {
            throw new ApiError(404, "Form not found or inactive");
        }
    }

    // 4. Find or Create Applicant
    // We update info if applicant exists, to keep profile fresh
    let applicant = await Applicant.findOne({ email });

    if (applicant) {
        applicant.name = fullName;
        if (resumeLink) applicant.resumeLink = resumeLink;
        if (portfolioLink) applicant.portfolioLink = portfolioLink;
        await applicant.save();
    } else {
        applicant = await Applicant.create({
            name: fullName,
            email,
            resumeLink,
            portfolioLink
        });
    }

    // 5. Create Application
    const application = await Application.create({
        job: jobId || undefined,
        form: formId || undefined,
        applicant: applicant._id,
        coverLetter,
        answers: answers || []
    });

    return res.status(201).json(
        new ApiResponse(201, application, "Application submitted successfully")
    );
});

// @desc    Get all applications (Admin)
// @route   GET /api/v1/applications
// @access  Private 
const getApplications = asyncHandler(async (req, res) => {
    const { jobId, status } = req.query;
    const filter = {};
    if (jobId) filter.job = jobId;
    if (status) filter.status = status;

    const applications = await Application.find(filter)
        .sort({ createdAt: -1 })
        .populate("job", "title")
        .populate("form", "title")
        .populate("applicant", "name email resumeLink portfolioLink");

    return res.status(200).json(
        new ApiResponse(200, applications, "Applications fetched successfully")
    );
});

// @desc    Get single application (Admin)
// @route   GET /api/v1/applications/:id
// @access  Private
const getApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const application = await Application.findById(id)
        .populate("job", "title")
        .populate("form", "title")
        .populate("applicant");

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new ApiResponse(200, application, "Application fetched successfully")
    );
});

// @desc    Update application status (Admin)
// @route   PUT /api/v1/applications/:id
// @access  Private
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new ApiResponse(200, application, "Status updated successfully")
    );
});

// @desc    Delete application (Admin)
// @route   DELETE /api/v1/applications/:id
// @access  Private
const deleteApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const application = await Application.findByIdAndDelete(id);

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Application deleted successfully")
    );
});


// @desc    Track Applications by Email (Public)
// @route   POST /api/v1/applications/track
// @access  Public
const trackApplications = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const applicant = await Applicant.findOne({ email });

    if (!applicant) {
        // Return empty array instead of 404 to avoid email enumeration or just simple UX
        // User requested "portal will track via applicant email", implies expecting list.
        return res.status(200).json(
            new ApiResponse(200, [], "No applications found")
        );
    }

    const applications = await Application.find({ applicant: applicant._id })
        .sort({ createdAt: -1 })
        .select("status createdAt job form")
        .populate("job", "title")
        .populate("form", "title");

    return res.status(200).json(
        new ApiResponse(200, applications, "Applications fetched successfully")
    );
});


export {
    submitApplication,
    getApplications,
    getApplication,
    updateApplicationStatus,
    deleteApplication,
    trackApplications // Renamed from getApplicationStatus
};
