import {Request, Response} from 'express';
import { TransactionModel } from '../../models/transaction.js';

export function getTransactions(req: Request, res: Response) {
    try{
        const orders = TransactionModel.find();
    } catch (error) {
        res.status(500).send({
            type: "urn:100-project:error:unable_to_get_transactions",
            title: "Unable to get transactions",
            status: 500,
            detail: "An error occured while fetching transactions"
        })
    }
}





