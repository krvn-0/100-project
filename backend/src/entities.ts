export interface User {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    isMerchant?: boolean;
    productIds?: string[];
};

export enum ProductType {
    CROP = 1,
    POULTRY = 2,
};

export interface Product {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    type: ProductType;
    quantity: number;
    unitPrice: number;
};
