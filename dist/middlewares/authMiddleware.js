import TokenService from "./../services/TokenService.js";
import ApiError from "../utils/ApiError.js";
export default function authMiddleware(req, res, next) {
    const authToken = req.headers.authorization;
    if (!authToken) {
        throw ApiError.UnauthorizedError("Unauthorized.");
    }
    const token = authToken.split(" ")[1];
    const decodedPayload = TokenService.validateAccessToken(token);
    if (!decodedPayload) {
        throw ApiError.UnauthorizedError("Invalid Bearer token");
    }
    req.user = decodedPayload;
    next();
}
//# sourceMappingURL=authMiddleware.js.map