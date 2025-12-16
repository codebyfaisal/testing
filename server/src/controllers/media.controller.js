import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, getCloudinaryResources, uploadOnCloudinary } from "../service/cloudinary.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getMedia = asyncHandler(async (req, res) => {
    const { resourceType = "image", nextCursor } = req.query;

    const data = await getCloudinaryResources(resourceType, nextCursor);

    return res.status(200).json(
        new ApiResponse(200, data, "Media fetched successfully")
    );
});

const deleteMedia = asyncHandler(async (req, res) => {
    const { publicId } = req.params;

    if (!publicId) throw new ApiError(400, "Public ID is required");

    const result = await deleteFromCloudinary(publicId);

    if (!result) throw new ApiError(500, "Failed to delete media");

    return res.status(200).json(
        new ApiResponse(200, result, "Media deleted successfully")
    );
});

const uploadMedia = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "File is required");

    const result = await uploadOnCloudinary(req.file.buffer);

    if (!result) throw new ApiError(500, "Failed to upload media");

    return res.status(201).json(
        new ApiResponse(201, result, "Media uploaded successfully")
    );
});


export { getMedia, deleteMedia, uploadMedia };
