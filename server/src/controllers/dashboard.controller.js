import { Project } from "../models/project.model.js";
import { Service } from "../models/service.model.js";
import { Testimonial } from "../models/testimonial.model.js";
import { Message } from "../models/message.model.js";
import { Plan } from "../models/plan.model.js";
import { User } from "../models/user.model.js";
import { Config } from "../models/config.model.js";
import Post from "../models/post.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getOverviewStats = asyncHandler(async (req, res) => {
    // 1. Fetch counts
    const projectCount = await Project.countDocuments();
    const serviceCount = await Service.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();
    const messageCount = await Message.countDocuments();
    const planCount = await Plan.countDocuments();
    const postCount = await Post.countDocuments();

    // 2. Fetch recent messages (e.g., last 5)
    const recentMessages = await Message.find()
        .sort({ createdAt: -1 })
        .limit(5);

    // 3. Health Check Logic
    const user = await User.findById(req.user?._id);
    const config = await Config.findOne({ user: req.user?._id }) || await Config.findOne();

    // Weights Configuration (Total 100)
    let score = 0;
    const checklist = [];

    // --- 1. User Profile Checks (30 pts) ---
    // Avatar (5)
    if (user?.avatar) score += 5;
    else checklist.push("Upload a Profile Picture");

    // Bio (10)
    if (user?.bio && user.bio.length > 20) score += 10;
    else checklist.push("Add a descriptive Bio (20+ chars)");

    // Resume (10)
    if (user?.resume) score += 10;
    else checklist.push("Upload your Resume");

    // Socials (5) - Check for at least 2 links
    const socialLinksCount = user?.socialLinks ? Object.values(user.socialLinks).filter(l => !!l).length : 0;
    if (socialLinksCount >= 2) score += 5;
    else checklist.push("Link at least 2 Social Media accounts");


    // --- 2. Content Checks (40 pts) ---
    // Projects (15) - 5 pts per project, max 3
    const projectPoints = Math.min(projectCount, 3) * 5;
    score += projectPoints;
    if (projectCount < 3) checklist.push(`Add ${3 - projectCount} more Project(s)`);

    // Services (15) - 7.5 pts per service, max 2
    const servicePoints = Math.min(serviceCount, 2) * 7.5;
    score += servicePoints;
    if (serviceCount < 2) checklist.push(`Add ${2 - serviceCount} more Service(s)`);

    // Plans (10) - Need at least 1 plan
    if (planCount >= 1) score += 10;
    else checklist.push("Create at least 1 Pricing Plan");





    // --- Final Status ---
    const health = {
        score: Math.round(score),
        status: "",
        checklist: checklist.slice(0, 5) // Limit to top 5 urgent items
    };

    if (score >= 90) health.status = "Perfect";
    else if (score >= 70) health.status = "Good";
    else if (score >= 40) health.status = "Weak";
    else health.status = "Poor";

    // 4. Construct response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                counts: {
                    projects: projectCount,
                    services: serviceCount,
                    testimonials: testimonialCount,
                    messages: messageCount,
                    plans: planCount,
                    posts: postCount
                },
                recentMessages,
                health
            },
            "Overview stats fetched successfully"
        )
    );
});

export { getOverviewStats };
