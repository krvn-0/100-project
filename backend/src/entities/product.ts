// src/entities/product.ts

import { Document, Types } from "mongoose";
import { User } from "./user.js";

export enum ProductType {
    CROP = 1,
    POULTRY = 2,
};

export interface ProductDAO extends Document {
    name: string;
    description: string;
    ownerId: Types.ObjectId;
    type: ProductType;
    quantity: number;
    unitPrice: number;
}

export type ProductDOT = {
    name: string;
    description: string;
    ownerId?: string;  
    type: ProductType;
    quantity: number;
    unitPrice: number;
};

export type Product = {
    name: string;
    description: string;
    ownerId?: string;
    type: ProductType;
    quantity: number;
    unitPrice: number;
    owner?: User;
};
