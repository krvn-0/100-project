import {Request, Response} from 'express';
import { TransactionModel } from '../../models/transaction.js';
import { TransactionDAO, TransactionStatus } from '../../entities/transaction.js';
import { ProductModel } from '../../models/product.js';
import { ProductDAO } from '../../entities/product.js';

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
        const transaction: TransactionDAO | null = await TransactionModel.findOne({
            user: req.query.userId,
            product: req.query.productId,
        });
        res.status(201).send(transaction);

        if(transaction === null) {
            res.status(404).send({
                type: "urn:100-project:error:transaction_not_found",
                title: "Transaction not Found",
                status: 404,
                detail: "The transaction does not exist"
            });
        }
    } catch (error) {
        res.status(500).send({
            type: "urn:100-project:error:unable_to_get_transactions",
            title: "Unable to get transactions",
            status: 500,
            detail: "An error occured while fetching transactions"
        });
    }
}

export async function confirmTransaction(req: Request, res: Response) {
    try{
        const transaction: TransactionDAO | null = await TransactionModel.findOne({
            _id: req.query.transactionId
        });
        
        if(transaction == null) {
            res.status(400).send({
                type: "urn:100-project:error:transaction_not_found",
                title: "Transaction Not Found",
                status: 404,
                detail: "The transaction does not exist"
            });
            return;
        }

        transaction.status = TransactionStatus.CONFIRMED;
        await transaction.save();

        let product: ProductDAO | null = await ProductModel.findOne({
            _id: transaction.product
        });

        if(product == null) {
            res.status(400).send({
                type: "urn:100-project:error:product_not_found",
                title: "Product Not Found",
                status: 404,
                detail: "The product associated with the transaction does not exist"
            });
            return;
        }
        
        product.quantity = product.quantity - transaction.quantity;
        await product.save();

        res.status(200).send({
            message: "Transaction confirmed and product quantity updated"
        });
    } catch (error) {
        res.status(500).send({
            type: "urn:100-project:error:unable_to_confirm_transaction",
            title: "Unable to Confirm Transaction",
            status: 500,
            detail: "An error occured while confirming the transaction"
        })
    }
}

