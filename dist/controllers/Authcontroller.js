import { validationResult } from "express-validator";
import AuthService from "./../services/AuthService.js";
import { RoleModel } from "./../models/UserModel.js";
import ApiError from "../utils/ApiError.js";
import TokenService from "../services/TokenService.js";
class AuthController {
    async getAll(req, res, next) {
        try {
            const userRoles = req.user.roles;
            if (!userRoles.includes("")) {
                throw ApiError.UnauthorizedError("Access denied. User is not an admin.");
            }
            const allUsers = await AuthService.getAll();
            res.status(200).json(allUsers);
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw ApiError.InternalServerError("Error during registration.");
            }
            const { name, email, password, roleIds } = req.body;
            const newUser = await AuthService.register(name, email, password, roleIds);
            TokenService.generateAccessToken(newUser);
            res.status(201).json(newUser);
        }
        catch (error) {
            next(ApiError.InternalServerError("Registration failed."));
        }
    }
    async login(req, res, next) {
        const { email, password } = req.body;
        try {
            const user = await AuthService.login(email, password);
            if (!user) {
                throw ApiError.UnauthorizedError("Authentication failed.");
            }
            res.status(200).json(user);
        }
        catch (error) {
            next(ApiError.InternalServerError("An internal server error occurred."));
        }
    }
    async createRole(req, res, next) {
        try {
            const { name } = req.body;
            const createdRole = await RoleModel.create({ name: name });
            res.status(201).json(createdRole);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteRole(req, res, next) {
        try {
            const roleID = req.params.id;
            const deletedRole = await RoleModel.findByIdAndDelete(roleID);
            if (!deletedRole) {
                throw ApiError.NotFoundError("Role not found.");
            }
            res.status(201).json(deletedRole);
        }
        catch (error) {
            next(ApiError.InternalServerError("Failed to delete."));
        }
    }
}
export default new AuthController();
//# sourceMappingURL=Authcontroller.js.map