import { Visit } from "../models/visit.model.js";
import { SystemSetting } from "../models/setting.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import geoip from "geoip-lite";

const logVisit = asyncHandler(async (req, res) => {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.connection.remoteAddress ||
        req.ip;

    const { page, userAgent: bodyUserAgent } = req.body;
    const userAgent = bodyUserAgent || req.headers["user-agent"];

    // 1. Check Global Cleanup Config
    const cleanupSetting = await SystemSetting.findOne({ key: "lastLogCleanup" });
    const lastCleanup = cleanupSetting?.value ? new Date(cleanupSetting.value) : null;

    // 2. Check Existing Cookie
    const lastVisitCookie = req.cookies?._unique_visit_session;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // If cookie exists, checks out, and no cleanup forced it to expire
    if (lastVisitCookie === today) {
        // Optimization: If we have a cleanup timestamp, check if the cookie was set BEFORE it?
        // Actually, if the cookie says "today" (YYYY-MM-DD), it's imprecise for time comparison.
        // But if a cleanup happened TODAY, we might want to re-log. 
        // For simplicity and matching previous client logic:
        // Previous client logic: if (lastLocalVisit && new Date(lastLocalVisit) < lastCleanup) -> clear cookie.
        // Here, our cookie only stores YYYY-MM-DD. 
        // If cleanup happened today, we can't easily tell if the cookie was set before or after cleanup just by "2024-12-12".
        // However, the cookie expires in 24h. 
        // Strict approach: If cleanup happened, we can't trust "today" unless we store ISO in cookie.
        // Let's store ISO in cookie to be safe and precise, or just stick to date if cleanup is rare.
        // The previous code stored "today" (YYYY-MM-DD) in _unique_visit_session AND isoString in localStorage.
        // Let's switch cookie to store ISO string to handle cleanup correctly.

        // WAIT. If I change cookie format, old cookies (YYYY-MM-DD) will fail Date parsing or be treated as date at 00:00.
        // "2024-12-12" -> Date is valid.

        // Let's try to parse cookie as date.
        const cookieDate = new Date(lastVisitCookie);

        // If cookie is valid date
        if (!isNaN(cookieDate.getTime())) {
            // If cleanup exists and cookie is older than cleanup
            if (lastCleanup && cookieDate < lastCleanup) {
                // Fall through to re-log
            } else {
                // If cookie is from today (local or UTC? matching logic...)
                // Previous logic: if (lastVisit !== today)
                // Let's stick to: if it's the same day, we skip.
                const cookieDay = cookieDate.toISOString().split("T")[0];
                if (cookieDay === today) {
                    return res.status(200).json(new ApiResponse(200, {}, "Visit already logged today"));
                }
            }
        }
    }

    // 3. Log New Visit
    const geo = geoip.lookup(ip);

    const visit = await Visit.create({
        ip,
        userAgent,
        page: page || "/",
        location: {
            country: geo?.country,
            city: geo?.city,
            region: geo?.region,
        }
    });

    // 4. Set Cookie (Expires in 24 hours)
    // Storing full ISO string to better support cleanup logic in future if needed, 
    // but the client-side check `if (lastVisit !== today)` relied on YYYY-MM-DD.
    // I will store ISO string now for better precision on server side checks.
    const now = new Date();
    res.cookie("_unique_visit_session", now.toISOString(), {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true, // Secure it
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    // Transparency: Allow client to see what was logged if they want (optional, keeping for backward compat or transparency)
    // The client used `_visitor_privacy_log`. I'll set it too but readable.
    res.cookie("_visitor_privacy_log", JSON.stringify(visit), {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: false, // Client needs to read this? actually previous code didn't read it for logic, just stored it.
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(201).json(new ApiResponse(201, visit, "Visit logged"));
});

// @desc    Get visitor statistics
// @route   GET /api/v1/visits/stats
// @access  Private (Admin)
const getVisitStats = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total Visits (All time / 30 days TTL)
    const totalVisits = await Visit.countDocuments();

    // 2. Unique Visitors Today
    // distinct IPs since midnight
    const uniqueToday = await Visit.distinct("ip", {
        createdAt: { $gte: today },
    });

    res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVisits,
                uniqueVisitorsToday: uniqueToday.length,
            },
            "Visitor stats fetched successfully"
        )
    );
});

// @desc    Get paginated visit logs
// @route   GET /api/v1/visits
// @access  Private (Admin)
// @desc    Get paginated visit logs with rich filtering
// @route   GET /api/v1/visits
// @access  Private (Admin)
const getAllVisits = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search,
        startDate,
        endDate,
        ip,
        country,
        city,
        region,
        path,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. General Search (Legacy support or quick search)
    if (search) {
        query.$or = [
            { ip: { $regex: search, $options: "i" } },
            { page: { $regex: search, $options: "i" } },
            { "location.country": { $regex: search, $options: "i" } }
        ];
    }

    // 2. Specific Filters (Optimization: Use these if provided)
    if (ip) query.ip = { $regex: ip, $options: "i" };
    if (country) query["location.country"] = { $regex: country, $options: "i" };
    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (region) query["location.region"] = { $regex: region, $options: "i" };
    if (path) query.page = { $regex: path, $options: "i" };

    // 3. Date Range Filter
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include full end day
            query.createdAt.$lte = end;
        }
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const visits = await Visit.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Visit.countDocuments(query);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                visits,
                meta: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            },
            "Visits fetched successfully"
        )
    );
});

// @desc    Bulk delete visits
// @route   DELETE /api/v1/visits
// @access  Private (Admin)
const deleteVisits = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "No visit IDs provided");
    }

    const result = await Visit.deleteMany({ _id: { $in: ids } });

    res.status(200).json(
        new ApiResponse(200, { deletedCount: result.deletedCount }, `Successfully deleted ${result.deletedCount} visits`)
    );
});



// ... existing imports

// @desc    Get visitor config (cleanup flags)
// @route   GET /api/v1/visits/config
// @access  Public
const getVisitConfig = asyncHandler(async (req, res) => {
    const setting = await SystemSetting.findOne({ key: "lastLogCleanup" });
    res.status(200).json(
        new ApiResponse(200, { lastLogCleanup: setting?.value || null }, "Config fetched")
    );
});

// @desc    Hard Delete (Wipe All) & Set Cleanup Flag
// @route   POST /api/v1/visits/cleanup
// @access  Private (Admin)
const cleanupVisits = asyncHandler(async (req, res) => {
    // 1. Wipe Full Collection
    const result = await Visit.deleteMany({});

    // 2. Set Flag to force client re-logging
    await SystemSetting.findOneAndUpdate(
        { key: "lastLogCleanup" },
        { value: new Date().toISOString() },
        { upsert: true, new: true }
    );

    res.status(200).json(
        new ApiResponse(
            200,
            { deletedCount: result.deletedCount },
            `System Wiped. ${result.deletedCount} visits deleted. Global re-log flag set.`
        )
    );
});

export { logVisit, getVisitStats, getAllVisits, deleteVisits, getVisitConfig, cleanupVisits };
