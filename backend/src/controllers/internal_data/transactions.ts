import {Request, Response} from 'express';
import { ProductDOT, ProductType, Transaction, TransactionStatus, User } from '../../entities.js';
import { transactions } from './data.js';


export function createTransaction(req: Request, res: Response) {
    const user: User = req.body.user;
    const product: ProductDOT = req.body.product;
    const quantity: number = req.body.quantity;
    const status: TransactionStatus = req.body.status;
    const timestamp: number = req.body.timestamp;


    if(user === undefined) {
        
    }

    if(typeof(quantity) !== 'number') {

    }

    if(typeof(timestamp) !== 'number') {

    }

    const id = Math.random().toString(16).substring(2, 14);

    transactions.push({
        id: id,
        user: user,
        product: product,
        quantity: quantity,
        status: status,
        timestamp: timestamp,
    });
}

