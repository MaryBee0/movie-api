import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true,
    },
});
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value.length >= 5;
            },
            message: "Name must be at least 5 characters long.",
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
            message: "Email is not valid.",
        },
    },
    password: {
        type: String,
        required: true,
        set: function (plainPassword) {
            return bcrypt.hashSync(plainPassword, 7);
        },
        get: function (hashedPassword) {
            return hashedPassword;
        },
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            default: "",
        },
    ],
});
const RoleModel = mongoose.model("Role", RoleSchema);
const UserModel = mongoose.model("User", UserSchema);
export { RoleModel, UserModel };
//# sourceMappingURL=UserModel.js.map