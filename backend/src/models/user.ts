import { Model, Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";

import { UserDAO } from "../entities/user.js";

const UserSchema = new Schema<UserDAO>({
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isMerchant: {
        type: Boolean,
        default: false,
    },
    productIds: {
        type: [Types.ObjectId],
        default: []
    },
});

// Salt and hash the user's password before saving it to the database.
UserSchema.pre('save', async function(next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

export const UserModel = model("User", UserSchema, "users");
