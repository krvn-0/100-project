import { Product } from "./product.js";

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
};
