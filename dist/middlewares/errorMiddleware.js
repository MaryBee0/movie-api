import ApiError from "../utils/ApiError.js";
function errorMiddleware(err, req, res, nextt) {
    if (err instanceof ApiError) {
        const status = err.status || 500;
        const message = err.message || "Internal Server Error";
        const timestamp = new Date();
        const errors = err.errors || [];
        res.status(err.status).json({ error: message, errors });
    }
    else {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export default errorMiddleware;
//# sourceMappingURL=errorMiddleware.js.map