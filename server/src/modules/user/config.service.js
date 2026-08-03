import { Config } from "./config.model.js";

const getConfig = async () => {
    let config = await Config.findOne();
    if (!config) config = {};
    return config;
};

const updateConfig = async (configData) => {
    let config = await Config.findOne();

    if (!config) {
        config = new Config(configData);
    } else {
        const { hero, about, messageTypes, appearance, featuredService } = configData;
        if (hero) config.hero = { ...config.hero, ...hero };
        if (about) config.about = { ...config.about, ...about };
        if (messageTypes) config.messageTypes = messageTypes;
        if (appearance) config.appearance = { ...config.appearance, ...appearance };
        if (featuredService) config.featuredService = { ...config.featuredService, ...featuredService };
    }

    await config.save();
    return config;
};

export const ConfigService = {
    getConfig,
    updateConfig
};
