import { NODE_ENV, CORS_ALLOWED_ORIGINS, CLIENT_ALLOWED_ORIGINS, ADMIN_ALLOWED_ORIGINS } from "../constants.js";
const allowOrigins = () => {
    let origins = [];
    if (NODE_ENV === "development")
        origins = CORS_ALLOWED_ORIGINS.split(",");
    else if (NODE_ENV === "production")
        origins = [...CLIENT_ALLOWED_ORIGINS.split(","), ...ADMIN_ALLOWED_ORIGINS.split(",")];

    return origins;
}

export default allowOrigins
