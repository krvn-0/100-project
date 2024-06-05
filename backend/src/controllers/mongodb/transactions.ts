import {Request, Response} from 'express';
import { TransactionModel } from '../../models/transaction.js';
import { Transaction, TransactionDAO, TransactionStatus } from '../../entities/transaction.js';
import { ProductModel } from '../../models/product.js';
import { ProductDAO } from '../../entities/product.js';
import { UserModel } from '../../models/user.js';
import { UserToken } from '../../entities/user.js';
import jwt from "jsonwebtoken";
import { TokenSecretManager } from './secrets.js';
import {Types} from 'mongoose';


export async function getTransactions(req: Request, res: Response) {

    const token = req.cookies?.token;
    let tokenBody: UserToken;
    try {
        tokenBody = jwt.verify(token!, TokenSecretManager.getCurrent()) as UserToken;
    } catch (err) {
        try {
            tokenBody = jwt.verify(token!, TokenSecretManager.getOld()) as UserToken;
            res.cookie(
                "token",
                jwt.sign(
                    {
                        userId: tokenBody.id,
                        isAdmin: tokenBody.isAdmin
                    },
                    TokenSecretManager.getCurrent(),
                    {
                        expiresIn: "7d"
                    }
                ),
                {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7
                }
            );
        }
        catch {
            res.status(401).send({
                type: "urn:100-project:error:not_logged_in",
                title: "Not Logged In",
                status: 401,
                detail: "You are not logged in."
            });
            return;
        }
    }

    // data set
    // no debate while presenting
    // wag magulat
    // june 7 10:30 - 11:00

    try{

        const buyerId = req.query.buyerId;
        const productId = req.query.productId;
        const sellerId = req.query.sellerId;

        const filter: any = {};
        if (buyerId) filter["user"] = buyerId;
        if (productId) filter["product"] = productId;

        const orders = await TransactionModel.find(filter);

        const mapping: Promise<Transaction | null>[] = orders.map(async (order) => {
            const buyer = (await UserModel.findById(order.user))!;
            const product = (await ProductModel.findById(order.product))!;
            if (sellerId && product.ownerId.toHexString() != sellerId) return null;
            
            const seller = (await UserModel.findById(product.ownerId))!;

            const transaction: Transaction = {
                user: {
                    id: buyer!._id.toHexString(),
                    firstName: buyer!.firstName,
                    middleName: buyer!.middleName,
                    lastName: buyer!.lastName,
                    email: buyer!.email,
                    isMerchant: buyer!.isMerchant
                },
                product: {
                    id: product._id.toHexString(),
                    name: product.name,
                    description: product.description,
                    type: product.type,
                    unitPrice: product.unitPrice,
                    owner: {
                        id: seller._id.toHexString(),
                        firstName: seller.firstName,
                        middleName: seller.middleName,
                        lastName: seller.lastName,
                        email: seller.email,
                        isMerchant: seller.isMerchant
                    }
                },
                quantity: order.quantity,
                status: order.status,
                timestamp: Date.parse(order.timestamp.toISOString()),
                price: product.unitPrice * order.quantity
            }

            return transaction;
        });

        const ret: Transaction[] = [];
        for (var promise of mapping) {
            const transaction = await promise;
            if (transaction) ret.push(transaction);
        }

        res.status(200).send(ret);
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
                type:"urn:100-project:transaction_not_found",
                title: "Transaction Not Found",
                status: 404,
                detail: "Transaction does not exist."
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

    const token = req.cookies?.token;
    let tokenBody: UserToken;
    try {
        tokenBody = jwt.verify(token!, TokenSecretManager.getCurrent()) as UserToken;
    } catch (err) {
        try {
            tokenBody = jwt.verify(token!, TokenSecretManager.getOld()) as UserToken;
            res.cookie(
                "token",
                jwt.sign(
                    {
                        userId: tokenBody.id,
                        isAdmin: tokenBody.isAdmin
                    },
                    TokenSecretManager.getCurrent(),
                    {
                        expiresIn: "7d"
                    }
                ),
                {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7
                }
            );
        }
        catch {
            res.status(401).send({
                type: "urn:100-project:error:not_logged_in",
                title: "Not Logged In",
                status: 401,
                detail: "You are not logged in."
            });
            return;
        }
    }

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

//TODO: make this more generic
export async function updateTransaction(req: Request, res: Response) {

    const token = req.cookies?.token;
    let tokenBody: UserToken;
    try {
        tokenBody = jwt.verify(token!, TokenSecretManager.getCurrent()) as UserToken;
    } catch (err) {
        try {
            tokenBody = jwt.verify(token!, TokenSecretManager.getOld()) as UserToken;
            res.cookie(
                "token",
                jwt.sign(
                    {
                        userId: tokenBody.id,
                        isAdmin: tokenBody.isAdmin
                    },
                    TokenSecretManager.getCurrent(),
                    {
                        expiresIn: "7d"
                    }
                ),
                {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7
                }
            );
        }
        catch {
            res.status(401).send({
                type: "urn:100-project:error:not_logged_in",
                title: "Not Logged In",
                status: 401,
                detail: "You are not logged in."
            });
            return;
        }
    }
    
    try{

        const id = req.params.id;

        // Validate if the ID is a valid ObjectId
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({
                type: "urn:100-project:error:malformed",
                title: "Malformed Request",
                status: 400,
                detail: "Invalid ID format"
            });
            return;
        }

        const transaction = await TransactionModel.findOne({
            _id: id
        });
        
        // check if transaction exists
        if(transaction === null) {
            res.status(404).send({
                type: "urn:100-project:error:transaction_not_found",
                title: "Transaction Not Found",
                status: 404,
                detail: "The transaction does not exist"
            });
            return;
        }

        // check if status is 
        if(transaction.status === TransactionStatus.CONFIRMED || transaction.status === TransactionStatus.CANCELLED){
            // TODO: add response message
            res.status(409).send({
                type: "urn:100-project:error:conflict",
                title: "Transaction Status in Conflict",
                status: 409,
                detail: "Transaction status must be of PENDING"
            });
            return;
        }
        
        const status: TransactionStatus = req.body.status; // get status from reqeust body

        if(status !== TransactionStatus.PENDING && status !== TransactionStatus.CONFIRMED && status !== TransactionStatus.CANCELLED){
            res.status(400).send({
                type: "urn:100-project:error:malformed",
                title: "Bad Request",
                status: 400,
                detail: "Status must be of enum TransactionStatus."
            })
        }

        transaction.status = status;
        await transaction.save();

        const product = await ProductModel.findOne({
            _id: transaction.product
        });

        if(product == null) {
            res.status(404).send({
                type: "urn:100-project:error:product_not_found",
                title: "Product Not Found",
                status: 404,
                detail: "The product associated with the transaction does not exist"
            });
            return;
        }
        
        product.quantity = product.quantity - transaction.quantity;
        await product.save();

        // return Transaction object

        const userdao = (await UserModel.findById(transaction.user))!;
        
        const productOwner = (await UserModel.findById(product.ownerId))!;

        const ret: Transaction = {
            user: {
                id: userdao._id.toHexString(),
                firstName: userdao.firstName,
                middleName: userdao.middleName,
                lastName: userdao.lastName,
                email: userdao.email,
            },
            product: {
                id: product._id.toHexString(),
                name: product.name,
                description: product.description,
                type: product.type,
                quantity: product.quantity,
                unitPrice: product.unitPrice,
                owner: {
                    id: productOwner._id.toHexString(),
                    lastName: productOwner.lastName,
                    middleName: productOwner.middleName,
                    firstName: productOwner.firstName,
                    email: productOwner.email,
                    isMerchant: productOwner.isMerchant,
                }
            },
            price: transaction.price,
            status: status,
            quantity: transaction.quantity,
            timestamp: Date.parse(transaction.timestamp.toISOString())
        };

        res.status(200).send(ret);

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

    const token = req.cookies?.token;
    let tokenBody: UserToken;
    try {
        tokenBody = jwt.verify(token!, TokenSecretManager.getCurrent()) as UserToken;
    } catch (err) {
        try {
            tokenBody = jwt.verify(token!, TokenSecretManager.getOld()) as UserToken;
            res.cookie(
                "token",
                jwt.sign(
                    {
                        userId: tokenBody.id,
                        isAdmin: tokenBody.isAdmin
                    },
                    TokenSecretManager.getCurrent(),
                    {
                        expiresIn: "7d"
                    }
                ),
                {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7
                }
            );
        }
        catch {
            res.status(401).send({
                type: "urn:100-project:error:not_logged_in",
                title: "Not Logged In",
                status: 401,
                detail: "You are not logged in."
            });
            return;
        }
    }
    
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

