import mongoose, { Schema } from "mongoose";

const configSchema = new Schema({
    hero: {
        greeting: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        subTitle: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
    },
    about: {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
    },
    messageTypes: [{
        type: { type: String, trim: true },
        color: { type: String, trim: true },
    }],
    appearance: {
        theme: {
            isCustom: { type: Boolean, default: false },
            colors: {
                secondary: { type: String, trim: true },
            },
            borderRadius: { type: Boolean, required: true, trim: true },
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
