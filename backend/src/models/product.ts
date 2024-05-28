import mongoose, { Schema, Types } from "mongoose";
import { ProductDAO } from "../entities/product.js";

const ProductSchema = new Schema<ProductDAO>({
    _id: {
        type: Types.UUID,
        default: () => new Types.UUID(),
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    ownerId: {
        type: Types.UUID,
        required: true,
    },
    type: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
});

export const ProductModel = mongoose.model("Product", ProductSchema, "products");
