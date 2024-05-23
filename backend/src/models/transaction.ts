import mongoose, {Schema, Types} from 'mongoose';
import {TransactionDAO} from '../entities/transaction.js';

const TransactionSchema = new Schema<TransactionDAO>({
    _id: {
        type: Types.UUID,
        default: () => new Types.UUID
    },
    user: {
        type: Types.UUID,
        required: true
    },
    product: {
        type: Types.UUID,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
})