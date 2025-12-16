import { Config } from "../models/config.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const updateConfig = asyncHandler(async (req, res) => {
    let config = await Config.findOne();

    if (!config) config = new Config(req.body);
    else {
        const { hero, about, messageTypes, appearance, featuredService } = req.body;
        if (hero) config.hero = { ...config.hero, ...hero };
        if (about) config.about = { ...config.about, ...about };
        if (messageTypes) config.messageTypes = messageTypes;
        if (appearance) config.appearance = { ...config.appearance, ...appearance };
        if (featuredService) config.featuredService = { ...config.featuredService, ...featuredService };
    }

    await config.save();

    return res.status(200).json(
        new ApiResponse(200, config, "Config updated successfully")
    );
});

const getConfig = asyncHandler(async (req, res) => {
    let config = await Config.findOne();
    if (!config) config = {};
    return res.status(200).json(
        new ApiResponse(200, config, "Config fetched successfully")
    );
});

export {
    updateConfig,
    getConfig
};
