import { Service } from "../models/service.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createService = asyncHandler(async (req, res) => {
    const { title, description, icon, features, plans, whyChooseMe, techStack, process, faq, cta } = req.body;

    const service = await Service.create({
        title,
        description,
        icon,
        features,
        plans,
        whyChooseMe,
        techStack,
        process,
        faq,
        cta
    });

    return res.status(201).json(
        new ApiResponse(201, service, "Service created successfully")
    );
});

const getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.find();
    return res.status(200).json(
        new ApiResponse(200, services, "Services fetched successfully")
    );
});

const getServiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) throw new ApiError(404, "Service not found");

    return res.status(200).json(
        new ApiResponse(200, service, "Service fetched successfully")
    );
});

const updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, icon, features, plans, whyChooseMe, techStack, process, faq, cta } = req.body;

    const service = await Service.findByIdAndUpdate(
        id,
        {
            $set: {
                title,
                description,
                icon,
                features,
                plans,
                whyChooseMe,
                techStack,
                process,
                faq,
                cta
            }
        },
        { new: true }
    );

    if (!service) throw new ApiError(404, "Service not found");

    return res.status(200).json(
        new ApiResponse(200, service, "Service updated successfully")
    );
});

const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) throw new ApiError(404, "Service not found");

    return res.status(200).json(
        new ApiResponse(200, {}, "Service deleted successfully")
    );
});

export {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
};
