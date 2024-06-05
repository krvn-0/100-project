import { Types } from "mongoose";
import { Product } from "./product.js";
import { CartItem, CartItemDao } from "./cart.js";

export type UserDAO = {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    isMerchant: boolean;
    productIds: Types.ObjectId[];
    cart: CartItemDao[];
};

export type UserDOT = {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin?: boolean;
    isMerchant?: boolean;
    productIds?: string[];
};

export type User = {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    isMerchant?: boolean;
    products?: Product[];
    cart?: CartItem[];
};

export type UserToken = {
    id: string;
    isAdmin: boolean;
    isMerchant: boolean;
};
