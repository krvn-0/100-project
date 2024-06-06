import { Request, Response } from "express";
import { UserToken } from "../../entities/user.js";
import { TokenManager } from "./secrets.js";
import { ProductModel } from "../../models/product.js";
import { Product, ProductDAO } from "../../entities/product.js";
import { UserModel } from "../../models/user.js";
import { Types } from "mongoose";

export async function getProducts(req: Request, res: Response) {
    let token = req.cookies?.token;
    if (token === undefined) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    let tokenPayload = TokenManager.verify(token);
    if (tokenPayload === null) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    // Reset token age
    res.cookie(
        "token",
        TokenManager.sign(tokenPayload),
        {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    );

    let productDaos = await ProductModel.find({
        deleted: false
    });
    let products: Product[] = [];

    for (let dao of productDaos) {
        let product: Product = {
            id: dao._id.toHexString(),
            name: dao.name,
            description: dao.description,
            type: dao.type,
            quantity: dao.quantity,
            unitPrice: dao.unitPrice,
            unit: dao.unit,
            imageUrl: dao.imageUrl
        };

        let ownerDao = await UserModel.findById(dao.ownerId);
        product.owner = {
            id: ownerDao!._id.toHexString(),
            firstName: ownerDao!.firstName,
            middleName: ownerDao!.middleName,
            lastName: ownerDao!.lastName,
            email: ownerDao!.email,
            isMerchant: ownerDao!.isMerchant
        }

        products.push(product);
    }

    res.status(200).send(products);
}

export async function createProduct(req: Request, res: Response) {
    let token = req.cookies?.token;
    if (token === undefined) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    let tokenPayload = TokenManager.verify(token);
    if (tokenPayload === null) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    // Reset token age
    res.cookie(
        "token",
        TokenManager.sign(tokenPayload),
        {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    );

    const tokenBody = tokenPayload as UserToken;

    if (!tokenBody.isMerchant) {
        res.status(403).send({
            type: "urn:100-project:error:forbidden",
            title: "Forbidden",
            status: 403,
            detail: "Your account is not registered as a merchant account."
        });
    }

    const name: string = req.body.name;
    const description: string = req.body.description ?? "";
    const type: number = req.body.type;
    const quantity: number = req.body.quantity;
    const unitPrice: number = req.body.unitPrice;
    const unit: string = req.body.productUnit ?? "";
    const imageUrl: string = req.body.imageUrl ?? "";

    if (typeof(name) !== 'string' || name.length < 1) {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "Name must be a non-empty string."
        });
        return;
    }

    if (typeof(description) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "Description must be a string."
        });
        return;
    }

    if (typeof(type) !== 'number') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "Type must be a number."
        });
        return;
    }

    if (typeof(quantity) !== 'number') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "Quantity must be a number."
        });
        return;
    }

    if (typeof(unitPrice) !== 'number') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "Unit price must be a number."
        });
        return;
    }

    if (typeof(unit) !== 'string' || unit.length < 1) {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "Unit must be a non-empty string."
        });
        return;
    }

    if (typeof(imageUrl) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "Image URL must be a string."
        });
        return;
    }

    const dao: ProductDAO = {
        name: name,
        description: description,
        ownerId: new Types.ObjectId(tokenBody.id),
        type: type,
        quantity: quantity,
        unitPrice: unitPrice,
        unit: unit,
        imageUrl: imageUrl
    };

    const product = new ProductModel(dao);
    await product.save();

    const merchant = (await UserModel.findById(tokenBody.id))!;
    const ret: Product = {
        id: product._id.toHexString(),
        name: product.name,
        description: product.description,
        type: product.type,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        unit: product.unit,
        imageUrl: product.imageUrl,
        owner: {
            id: merchant._id.toHexString(),
            firstName: merchant.firstName,
            middleName: merchant.middleName,
            lastName: merchant.lastName,
            email: merchant.email,
            isMerchant: merchant.isMerchant
        }
    };

    res.status(200).send(ret)
}

export async function getProduct(req: Request, res: Response) {
    let token = req.cookies?.token;
    if (token === undefined) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    let tokenPayload = TokenManager.verify(token);
    if (tokenPayload === null) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    // Reset token age
    res.cookie(
        "token",
        TokenManager.sign(tokenPayload),
        {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    );

    const tokenBody = tokenPayload as UserToken;

    const id = req.params.id;
    const product = await ProductModel.findOne({
        _id: id,
        ownerId: tokenBody.id
    });
    if (product === null) {
        res.status(404).send({
            type: "urn:100-project:error:not_found",
            title: "Not Found",
            status: 404,
            detail: "Product not found."
        });
        return;
    }

    const owner = (await UserModel.findById(product.ownerId))!;

    const ret: Product = {
        id: product._id!.toHexString(),
        name: product.name,
        description: product.description,
        type: product.type,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        unit: product.unit,
        imageUrl: product.imageUrl,
        owner: {
            id: owner._id.toHexString(),
            firstName: owner.firstName,
            middleName: owner.middleName,
            lastName: owner.lastName,
            email: owner.email,
            isMerchant: owner.isMerchant
        }
    };

    res.status(200).send(ret)
}

export async function updateProduct(req: Request, res: Response) {
    let token = req.cookies?.token;
    if (token === undefined) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    let tokenPayload = TokenManager.verify(token);
    if (tokenPayload === null) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    // Reset token age
    res.cookie(
        "token",
        TokenManager.sign(tokenPayload),
        {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    );

    const tokenBody = tokenPayload as UserToken;

    if (!tokenBody.isMerchant && !tokenBody.isAdmin) {
        res.status(403).send({
            type: "urn:100-project:error:forbidden",
            title: "Forbidden",
            status: 403,
            detail: "Your account is not registered as a merchant account."
        });
        return;
    }

    const id = req.params.id;
    const product = await ProductModel.findById(id);
    if (product === null) {
        res.status(404).send({
            type: "urn:100-project:error:not_found",
            title: "Not Found",
            status: 404,
            detail: "Product not found."
        });
        return;
    }

    if (tokenBody.id !== product.ownerId.toHexString() && !tokenBody.isAdmin) {
        res.status(403).send({
            type: "urn:100-project:error:forbidden",
            title: "Forbidden",
            status: 403,
            detail: "You do not own this product."
        });
        return;
    }

    const description: string | undefined = req.body.description;
    const quantity: number | undefined = req.body.quantity;
    const unitPrice: number | undefined = req.body.unitPrice;

    if (description !== undefined) {
        if (typeof description !== "string") {
            res.status(400).send({
                type: "urn:100-project:error:malformed_request",
                title: "Malformed Request",
                status: 400,
                detail: "Description must be a string."
            });
            return;
        }
        product.set("description", description)
    }

    if (quantity !== undefined) {
        if (typeof quantity !== "number") {
            res.status(400).send({
                type: "urn:100-project:error:malformed_request",
                title: "Malformed Request",
                status: 400,
                detail: "Quantity must be a number."
            });
            return;
        }
        product.set("quantity", quantity)
    }

    if (unitPrice !== undefined) {
        if (typeof unitPrice !== "number") {
            res.status(400).send({
                type: "urn:100-project:error:malformed_request",
                title: "Malformed Request",
                status: 400,
                detail: "Unit price must be a number."
            });
            return;
        }
        product.set("unitPrice", unitPrice)
    }

    await product.save();
    
    const owner = (await UserModel.findById(product.ownerId))!;
    const ret: Product = {
        id: product._id!.toHexString(),
        name: product.name,
        description: product.description,
        type: product.type,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        unit: product.unit,
        imageUrl: product.imageUrl,
        owner: {
            id: owner._id.toHexString(),
            firstName: owner.firstName,
            middleName: owner.middleName,
            lastName: owner.lastName,
            email: owner.email,
            isMerchant: owner.isMerchant
        }
    };

    res.status(200).send(ret)
}

export async function deleteProduct(req: Request, res: Response) {
    let token = req.cookies?.token;
    if (token === undefined) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    let tokenPayload = TokenManager.verify(token);
    if (tokenPayload === null) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    // Reset token age
    res.cookie(
        "token",
        TokenManager.sign(tokenPayload),
        {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    );

    const tokenBody = tokenPayload as UserToken;

    if (!tokenBody.isMerchant && !tokenBody.isAdmin) {
        res.status(403).send({
            type: "urn:100-project:error:forbidden",
            title: "Forbidden",
            status: 403,
            detail: "Your account is not registered as a merchant account."
        });
        return;
    }

    const id = req.params.id;
    const product = await ProductModel.findOne({
        _id: id,
        deleted: false
    });
    if (product === null) {
        res.status(404).send({
            type: "urn:100-project:error:not_found",
            title: "Not Found",
            status: 404,
            detail: "Product not found."
        });
        return;
    }

    if (tokenBody.id !== product.ownerId.toHexString() && !tokenBody.isAdmin) {
        res.status(403).send({
            type: "urn:100-project:error:forbidden",
            title: "Forbidden",
            status: 403,
            detail: "You do not own this product."
        });
        return;
    }

    await product.deleteOne();
    res.status(204).send();
}
