import mongoose, { Schema } from "mongoose";
import { ProductDAO } from "../entities/product.js";

const ProductSchema = new Schema<ProductDAO>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    ownerId: {
        type: "ObjectId",
        required: true
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
    unit: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: "",
    },
});

export const ProductModel = mongoose.model("Product", ProductSchema, "products");
