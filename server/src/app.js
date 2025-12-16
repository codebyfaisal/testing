import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import allowOrigins from "./utils/allowOrigins.js";

const app = express();

app.use(cors(
    {
        origin: allowOrigins(),
        credentials: true
    }
));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from './routes/user.routes.js';
import serviceRouter from './routes/service.routes.js';
import projectRouter from './routes/project.routes.js';
import testimonialRouter from './routes/testimonial.routes.js';
import messageRouter from './routes/message.routes.js';
import mediaRouter from './routes/media.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import visitRouter from './routes/visit.routes.js';

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/testimonials", testimonialRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/visits", visitRouter);

import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export default app;
