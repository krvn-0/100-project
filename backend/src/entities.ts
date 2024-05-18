export type UserDOT = {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    isAdmin?: boolean;
    isMerchant?: boolean;
    productIds?: string[];
};

export enum ProductType {
    CROP = 1,
    POULTRY = 2,
};

export enum TransactionStatus {
    CANCELLED = -1,
    PENDING = 0,
    CONFIRMED = 1
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

export type User = {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    isMerchant?: boolean;
    products?: Product[];
};

export type Product = {
    id: string;
    name: string;
    description: string;
    type: ProductType;
    quantity: number;
    unitPrice: number;
    owner?: User;
};

export type Transaction = {
    id: string,
    user: User,
    product: Product,
    quantity: number,
    status: TransactionStatus,
    timestamp: number,
}
