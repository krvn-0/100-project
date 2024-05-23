import mongoose, {Schema, Types} from 'mongoose';
import {TransactionDAO} from '../entities/transaction.js';

const TransactionSchema = new Schema<TransactionDAO>({
    user: {
        type: Types.ObjectId,
        required: true
    },
    product: {
        type: Types.ObjectId,
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
});

export mongoose.model("Transaction", TransactionSchema, "transactions");