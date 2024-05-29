import {Document, Types} from 'mongoose';
import {User} from './user.js';
import {Product} from './product.js';
 
export enum TransactionStatus {
    CANCELLED = -1,
    PENDING = 0,
    CONFIRMED = 1
}

export type Transaction = {
    user: User,
    product: Product,
    quantity: number,
    status: TransactionStatus,
    timestamp: number
}

export type TransactionDAO = {
    user: Types.ObjectId,
    product: Types.ObjectId,
    quantity: number,
    status: TransactionStatus,
    timestamp: Date
}