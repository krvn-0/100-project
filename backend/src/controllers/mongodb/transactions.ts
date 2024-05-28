import {Request, Response} from 'express';
import { TransactionModel } from '../../models/transaction.js';
import { TransactionStatus } from '../../entities/transaction.js';

export async function getTransactions(req: Request, res: Response) {
    try{
        const orders = await TransactionModel.find();
        res.status(201).send(orders);
    } catch (error) {
        res.status(500).send({
            type: "urn:100-project:error:unable_to_get_transactions",
            title: "Unable to get transactions",
            status: 500,
            detail: "An error occured while fetching transactions"
        })
    }
}

export async function getActiveTransactions(req: Request, res: Response){
    try{
        const orders = await TransactionModel.find({
            status: TransactionStatus.PENDING,
        });
        res.status(201).send(orders);
    }catch(error){
        res.status(500).send({
            type: "urn:100-project:error:unable_to_get_transactions",
            title: "Unable to get transactions",
            status: 500,
            detail: "An error occured while fetching transactions"
        })
    }
}

export async function getTransactionByUserAndProduct(req: Request, res: Response) {
    try{
        const order = await TransactionModel.findOne({
            user: req.query.userId,
            product: req.query.productId,
        });
        res.status(201).send(order);
    } catch (error) {
        res.status(500).send({
            type: "urn:100-project:error:unable_to_get_transactions",
            title: "Unable to get transactions",
            status: 500,
            detail: "An error occured while fetching transactions"
        });
    }
} 


