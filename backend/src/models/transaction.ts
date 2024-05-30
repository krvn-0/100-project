import mongoose, {Schema, Types} from 'mongoose';
import {TransactionDAO, TransactionStatus} from '../entities/transaction.js';

const TransactionSchema = new Schema<TransactionDAO>({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true,
        enum: [TransactionStatus.CANCELLED, TransactionStatus.CONFIRMED, TransactionStatus.PENDING]
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
});

export const TransactionModel = mongoose.model("Transaction", TransactionSchema, "transactions");