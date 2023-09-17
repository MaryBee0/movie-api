import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import TokenService from "./TokenService.js";
class AuthService {
    async isAdmin(user) {
        return user.roles.includes("64f602068cbe339f606b076d");
    }
    async getAll() {
        try {
            const allUsers = await UserModel.find()
                .populate("roles")
                .select("-password");
            console.log(allUsers);
            return allUsers;
        }
        catch (error) {
            throw error;
        }
    }
    async getOne(userId) {
        try {
            const user = await UserModel.findById(userId)
                .populate("roles")
                .select("-password");
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async register(name, email, password, roleIds = []) {
        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new Error(`User ${name} already exists`);
            }
            const rolesToAssign = roleIds.length > 0 ? roleIds : [""];
            const newUser = new UserModel({
                name,
                email,
                password,
                roles: rolesToAssign,
            });
            const savedUser = await newUser.save();
            return savedUser;
        }
        catch (error) {
            throw new Error("Registration failed.");
        }
    }
    async login(email, password) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return null;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return null;
            }
            const token = TokenService.generateAccessToken(user);
            return { token, user };
        }
        catch (error) {
            throw new Error("Login failed");
        }
    }
}
export default new AuthService();
//# sourceMappingURL=AuthService.js.map