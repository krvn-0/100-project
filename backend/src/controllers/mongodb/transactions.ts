import {Request, Response} from 'express';
import { TransactionModel } from '../../models/transaction.js';
import { TransactionDAO, TransactionStatus } from '../../entities/transaction.js';
import { ProductModel } from '../../models/product.js';
import { ProductDAO } from '../../entities/product.js';
import { UserModel } from '../../models/user.js';

export async function getTransactions(req: Request, res: Response) {
    try{
        const orders = await TransactionModel.find();
        res.status(201).send(orders);
    } catch (error) {
        res.status(500).send({
            type: "urn:100-project:error:internal_server_error",
            title: "Internal Server Error",
            status: 500,
            detail: "An error occured while fetching transactions"
        });
    }
}

export async function getActiveTransactions(req: Request, res: Response){
    try{
        const orders = await TransactionModel.find({
            status: TransactionStatus.PENDING,
        });
        if(orders === null) {
            res.status(404).send({
                type:"urn:100-project:"
            })
        }
        res.status(201).send(orders);
    }catch(error){
        res.status(500).send({
            type: "urn:100-project:error:internal_server_error",
            title: "Internal Server Error",
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
            type: "urn:100-project:error:internal_server_error",
            title: "Internal Server Error",
            status: 500,
            detail: "An error occured while fetching transactions"
        });
    }
}

export async function confirmTransaction(req: Request, res: Response) {
    try{
        const transaction = await TransactionModel.findOne({
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

        const product = await ProductModel.findOne({
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
            type: "urn:100-project:error:internal_server_error",
            title: "Internal Server Error",
            status: 500,
            detail: "An error occured while confirming the transaction"
        })
    }
}

export async function createTransaction(req: Request, res: Response) {
    
    try {
        const productId = req.query.productId;
        const quantity = req.query.quantity; 
        const userId = req.query.userId;

        // check if productid, quantity, userId types are correct
        if(typeof(productId) !== 'string' || typeof(quantity) !== 'number' || typeof(userId) !== 'string'){
            res.status(400).send({
                type: "urn:100-project:error:malformed",
                title: "Malformed Request",
                status: 400,
                detail: "Product id and user id must be strings and quantity must be number"
            });
            return;
        }

        // fetch user
        const user = await UserModel.findById(userId);

        // check if user exists
        if(user === null) {
            res.status(404).send({
                type: "urn:100-project:error:user_not_found",
                title: "User Not Found",
                status: 404,
                detail: "User does not exist."
            });
            return;
        }

        // fetch product
        const product = await ProductModel.findById(productId);

        // check if product exists
        if(product === null) {
            res.status(404).send({
                type: "urn:100-project:error:product_not_found",
                title: "Product Not Found",
                status: 404,
                detail: "Product does not exist."
            });
            return;
        }

        // create transaction and set fields
        const transaction = new TransactionModel();
        transaction.set('user', user);
        transaction.set("product", product);
        transaction.set('quantity', quantity) ;
        transaction.set("status", TransactionStatus.PENDING); // default when new transaction
        transaction.set("timestamp", Date.now) 

        res.status(200).send(transaction);

    } catch(error) {
        res.status(500).send({
            type: "urn:100-project:error:internal_server_error",
            title: "Internal Server Error",
            status: 500,
            detail: "An error occured while creating transaction"
        })
    }
}

