import { Plan } from "../models/plan.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlan = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        deliveryTime,
        revisions,
        features,
        addOns,
        popular,
        isCustom
    } = req.body;

    const plan = await Plan.create({
        name,
        price,
        deliveryTime,
        revisions,
        features,
        addOns,
        popular,
        isCustom
    });

    return res.status(201).json(
        new ApiResponse(201, plan, "Plan created successfully")
    );
});

const getAllPlans = asyncHandler(async (req, res) => {
    const plans = await Plan.find();
    return res.status(200).json(
        new ApiResponse(200, plans, "Plans fetched successfully")
    );
});

const getPlanById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan) {
        throw new ApiError(404, "Plan not found");
    }

    return res.status(200).json(
        new ApiResponse(200, plan, "Plan fetched successfully")
    );
});

const updatePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        price,
        deliveryTime,
        revisions,
        features,
        addOns,
        popular,
        isCustom
    } = req.body;

    const plan = await Plan.findByIdAndUpdate(
        id,
        {
            $set: {
                name,
                price,
                deliveryTime,
                revisions,
                features,
                addOns,
                popular,
                isCustom
            }
        },
        { new: true }
    );

    if (!plan) {
        throw new ApiError(404, "Plan not found");
    }

    return res.status(200).json(
        new ApiResponse(200, plan, "Plan updated successfully")
    );
});

const deletePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const plan = await Plan.findByIdAndDelete(id);

    if (!plan) {
        throw new ApiError(404, "Plan not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Plan deleted successfully")
    );
});

export {
    createPlan,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan
};
