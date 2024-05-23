import {Request, Response} from 'express';
import {Transaction} from '../entities/transaction.ts';
import {Types} from 'mongoose';

export function getTransactions(req: Request, res: Response) {

}

export function createTransactions(req: Request, res: Response) {
    const product: Types.ObjectId = req.body.product;
    const quantity: number = req.body.quantity;
}