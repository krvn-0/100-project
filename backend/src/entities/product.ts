import { Types } from "mongoose";
import { User } from "./user.js";

export enum ProductType {
    CROP = 1,
    POULTRY = 2,
};

export type ProductDAO = {
    // _id: Types.UUID;
    name: string;
    description: string;
    ownerId: Types.UUID;
    type: ProductType;
    quantity: number;
    unitPrice: number;
}

export type ProductDOT = {
    // id: string;
    name: string;
    description: string;
    ownerId?: string;
    type: ProductType;
    quantity: number;
    unitPrice: number;
};

export type Product = {
    // id: string;
    name: string;
    description: string;
    ownerId?: string;
    type: ProductType;
    quantity: number;
    unitPrice: number;
    owner?: User;
};
