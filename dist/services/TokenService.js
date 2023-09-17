import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
class TokenService {
    constructor() {
        this.secretKey = process.env.SECRET_ACCESS_TOKEN_KEY;
    }
    generateAccessToken(user) {
        try {
            console.log(user);
            if (!this.secretKey) {
                throw new Error("Internal error");
            }
            const payload = {
                id: user.id,
                email: user.email,
                roles: user.roles,
            };
            const accessToken = jwt.sign(payload, this.secretKey, {
                expiresIn: "15d",
            });
            return accessToken;
        }
        catch (error) {
            return "";
        }
    }
    validateAccessToken(token) {
        try {
            if (!this.secretKey) {
                throw new Error("Internal error");
            }
            const userPayload = jwt.verify(token, this.secretKey);
            return userPayload;
        }
        catch (error) {
            return null;
        }
    }
}
export default new TokenService();
//# sourceMappingURL=TokenService.js.map