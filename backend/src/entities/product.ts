
import { Types } from "mongoose";
import { User } from "./user.js";

export enum ProductType {
    CROP = 1,
    POULTRY = 2,
};

export type ProductDAO = {
    name: string;
    description: string;
    ownerId: Types.ObjectId;
    type: ProductType;
    quantity: number;
    unitPrice: number;
    unit: string;
}

export type ProductDOT = {
    id: string;
    name: string;
    description: string;
    ownerId?: string;
    type: ProductType;
    quantity: number;
    unitPrice: number;
};

export type Product = {
    id: string;
    name: string;
    description: string;
    type: ProductType;
    quantity?: number;
    unitPrice: number;
    owner?: User;
};
