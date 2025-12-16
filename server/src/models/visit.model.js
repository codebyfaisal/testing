import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
    },
    page: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "60d", // TTL index: Auto-delete after 2 months (60 days)
    },
    location: {
      country: String,
      city: String,
      region: String,
    },
  },
  { timestamps: true }
);

// TTL Index: Auto-delete logs after 30 days (2592000 seconds)
visitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Visit = mongoose.model("Visit", visitSchema);
