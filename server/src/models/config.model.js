import mongoose, { Schema } from "mongoose";

const configSchema = new Schema({
    hero: {
        greeting: { type: String, trim: true },
        title: { type: String, trim: true },
        subTitle: { type: String, trim: true },
        image: { type: String, trim: true },
    },
    about: {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        image: { type: String, trim: true },
    },
    messageTypes: [{
        type: { type: String, trim: true },
        typeColor: { type: String, trim: true, default: "#ffffff" },
    }],
    appearance: {
        theme: {
            isCustom: { type: Boolean, default: false },
            colors: {
                secondary: { type: String, trim: true },
            },
            borderRadius: { type: Boolean, trim: true },
        },
    },
    featuredService: {
        serviceId: { type: String, trim: true },
        title: { type: String, trim: true },
        image: { type: String, trim: true },
        description: { type: String, trim: true }
    }
}, { timestamps: true });

export const Config = mongoose.model("Config", configSchema);
