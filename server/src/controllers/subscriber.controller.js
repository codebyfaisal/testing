import { Subscriber } from "../models/subscriber.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
        if (!existingSubscriber.isSubscribed) {
            existingSubscriber.isSubscribed = true;
            await existingSubscriber.save();
            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        existingSubscriber,
                        "Welcome back! You have successfully resubscribed."
                    )
                );
        }
        return res
            .status(409)
            .json(
                new ApiResponse(
                    409,
                    existingSubscriber,
                    "You are already subscribed to the newsletter."
                )
            );
    }

    const subscriber = await Subscriber.create({ email });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                subscriber,
                "Successfully subscribed to the newsletter!"
            )
        );
});

const getSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribers,
                "Subscribers fetched successfully"
            )
        );
});

const deleteSubscriber = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
        throw new ApiError(404, "Subscriber not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { id: subscriber._id },
                "Subscriber removed successfully"
            )
        );
});

export { subscribe, getSubscribers, deleteSubscriber };
