import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import allowOrigins from "./utils/allowOrigins.js";

const app = express();

app.use(helmet());

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

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.get("/api/v1/test", (req, res) => {
    return res.json({
        message: "Welcome to the API: " + req.originalUrl,
        origins: allowOrigins()
    });
});

// routes import
import userRouter from './routes/user.routes.js';
import serviceRouter from './routes/service.routes.js';
import projectRouter from './routes/project.routes.js';
import testimonialRouter from './routes/testimonial.routes.js';
import messageRouter from './routes/message.routes.js';
import fileRouter from './routes/file.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import visitRouter from './routes/visit.routes.js';
import postRouter from './routes/post.routes.js';
import subscriberRouter from './routes/subscriber.routes.js';
import jobRouter from './routes/job.routes.js';
import formRouter from './routes/form.routes.js';

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/testimonials", testimonialRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/files", fileRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/visits", visitRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/subscribers", subscriberRouter);
app.use("/api/v1", jobRouter);
app.use("/api/v1/forms", formRouter);

import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export default app;
