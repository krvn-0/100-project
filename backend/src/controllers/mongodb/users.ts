import { Request, Response } from "express";
import { User, UserDAO, UserToken } from "../../entities/user.js";
import { TokenManager } from "./secrets.js";
import { UserModel } from "../../models/user.js";
import { ProductModel } from "../../models/product.js";
import { CartItemDao } from "../../entities/cart.js";
import { Types } from "mongoose";

export async function getUsers(req: Request, res: Response) {
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

    let userDaos;
    if (tokenBody.isAdmin) {
        userDaos = await UserModel.find({
            deleted: false
        });
    } else {
        userDaos = await UserModel.find({
            _id: tokenBody.id,
            deleted: false
        });
    }
    const users: User[] = [];

    for (const dao of userDaos) {
        let user: User = {
            id: dao._id!.toHexString(),
            firstName: dao.firstName,
            middleName: dao.middleName,
            lastName: dao.lastName,
            email: dao.email,
            isMerchant: dao.isMerchant
        };

        if (dao.isMerchant) {
            let productIds = dao.get("productIds");
            let results = await ProductModel.find({
                "_id": {
                    $in: productIds
                }
            });

            user.products = results.map((dao) => {
                return {
                    id: dao._id.toHexString(),
                    name: dao.name,
                    description: dao.description,
                    type: dao.type,
                    quantity: dao.quantity,
                    unitPrice: dao.unitPrice,
                    unit: dao.unit,
                    imageUrl: dao.imageUrl
                }
            });
        }

        let cart = dao.get("cart");
        if (cart === undefined) {
            user.cart = [];
        } else {
            let cartQuantities = Object.fromEntries(cart.map((cartItem) => [cartItem.productId, cartItem.quantity]));
            let cartProducts = await ProductModel.find({
                _id: {
                    $in: cart.map((cartItem) => cartItem.productId)
                }
            });

            user.cart = cartProducts.map((product) => {
                return {
                    product: {
                        id: product._id!.toHexString(),
                        name: product.name,
                        description: product.description,
                        type: product.type,
                        quantity: product.quantity,
                        unitPrice: product.unitPrice,
                        unit: product.unit,
                        imageUrl: product.imageUrl
                    },
                    quantity: cartQuantities[product._id!.toHexString()]
                }
            });
        }

        users.push(user);
    }

    res.send(users);
}

export async function createUser(req: Request, res: Response) {
    const firstName: string = req.body.firstName;
    const middleName: string | undefined = req.body.middleName;
    const lastName: string = req.body.lastName;
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (typeof (firstName) !== 'string' || (middleName !== undefined && typeof (middleName) !== 'string') || typeof (lastName) !== 'string' || typeof (email) !== 'string' || typeof (password) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed",
            status: 400,
            detail: "First name, middle name (optional), last name, email, and password must be strings."
        });
        return;
    }

    if (await UserModel.exists({ email: email })) {
        res.status(409).send({
            type: "urn:100-project:error:email_in_use",
            title: "Email Address In Use",
            status: 409,
            detail: "The email address is already in use."
        });
        return;
    }

    const user = new UserModel();
    user.set("firstName", firstName);
    if (middleName !== undefined) {
        user.set("middleName", middleName);
    }
    user.set("lastName", lastName);
    user.set("email", email);
    user.set("password", password);
    user.set("isMerchant", false);
    user.set("isAdmin", false);

    await user.save();

    res.status(201).send({
        id: user._id!.toHexString(),
        firstName: user.get("firstName"),
        middleName: user.get("middleName"),
        lastName: user.get("lastName"),
        email: user.get("email"),
        isMerchant: false
    });
}

export async function getUser(req: Request, res: Response) {
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
    const targetUser = await UserModel.findOne({
        _id: id,
        deleted: false
    });

    if (targetUser === null) {
        res.status(404).send({
            type: "urn:100-project:error:user_not_found",
            title: "User Not Found",
            status: 404,
            detail: "The user does not exist."
        });
        return;
    }

    if (!tokenBody.isAdmin && targetUser.id !== tokenBody.id) {
        res.status(403).send({
            type: "urn:100-project:error:forbidden",
            title: "Forbidden",
            status: 403,
            detail: "You do not have permission to view this user."
        });
    }

    const ret: User = {
        id: targetUser._id!.toHexString(),
        firstName: targetUser.get("firstName"),
        middleName: targetUser.get("middleName"),
        lastName: targetUser.get("lastName"),
        email: targetUser.get("email"),
        isMerchant: targetUser.get("isMerchant")
    };

    if (targetUser.get("isMerchant")) {
        let productIds = targetUser.get("productIds");
        let results = await ProductModel.find({
            "_id": {
                $in: productIds
            }
        });

        ret.products = results.map((dao) => {
            return {
                id: dao._id.toHexString(),
                name: dao.name,
                description: dao.description,
                type: dao.type,
                quantity: dao.quantity,
                unitPrice: dao.unitPrice,
                unit: dao.unit,
                imageUrl: dao.imageUrl
            };
        });
    }

    let cart = targetUser.get("cart");
    if (cart === undefined) {
        ret.cart = [];
    } else {
        let cartQuantities = Object.fromEntries(cart.map((cartItem) => [cartItem.productId, cartItem.quantity]));
        let cartProducts = await ProductModel.find({
            _id: {
                $in: cart.map((cartItem) => cartItem.productId)
            }
        });

        ret.cart = cartProducts.map((product) => {
            return {
                product: {
                    id: product._id!.toHexString(),
                    name: product.name,
                    description: product.description,
                    type: product.type,
                    quantity: product.quantity,
                    unitPrice: product.unitPrice,
                    unit: product.unit,
                    imageUrl: product.imageUrl
                },
                quantity: cartQuantities[product._id!.toHexString()]
            }
        });
    }

    res.status(200).send(ret);
}

export async function updateUser(req: Request, res: Response) {
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
    if (id !== tokenBody.id && !tokenBody.isAdmin) {
        res.status(403).send({
            type: "urn:100-project:error:forbidden",
            title: "Forbidden",
            status: 403,
            detail: "You do not have permission to edit this user."
        });
        return;
    }

    const targetUser = await UserModel.findOne({
        _id: id,
        deleted: false
    })
    if (targetUser === null) {
        res.status(404).send({
            type: "urn:100-project:error:user_not_found",
            title: "User Not Found",
            status: 404,
            detail: "The user does not exist."
        });
        return;
    }

    if (req.body.firstName !== undefined && typeof (req.body.firstName) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed",
            status: 400,
            detail: "firstName must be a string."
        });
        return;
    }

    if (req.body.middleName !== undefined && typeof (req.body.middleName) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed",
            status: 400,
            detail: "middleName must be a string."
        });
        return;
    }

    if (req.body.lastName !== undefined && typeof (req.body.lastName) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed",
            status: 400,
            detail: "lastName must be a string."
        });
        return;
    }

    if (req.body.email !== undefined && typeof (req.body.email) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed",
            status: 400,
            detail: "email must be a string."
        });
        return;
    }

    if (req.body.cart !== undefined) {
        if (!Array.isArray(req.body.cart)) {
            res.status(400).send({
                type: "urn:100-project:error:malformed",
                title: "Malformed",
                status: 400,
                detail: "cart must be an array."
            });
            return;
        }

        for (let cartItem of req.body.cart) {
            if (typeof (cartItem) !== 'object') {
                res.status(400).send({
                    type: "urn:100-project:error:malformed",
                    title: "Malformed",
                    status: 400,
                    detail: "cart must be an array of objects."
                });
                return;
            }

            if (!("product" in cartItem) || !(typeof(cartItem.product) === 'string' || (typeof(cartItem.product) === 'object' && typeof(cartItem.product.id) === 'string'))) {
                res.status(400).send({
                    type: "urn:100-project:error:malformed",
                    title: "Malformed",
                    status: 400,
                    detail: "cart item must refer to a product."
                })
            }

            if (!("quantity" in cartItem) || typeof(cartItem.quantity) !== 'number') {
                res.status(400).send({
                    type: "urn:100-project:error:malformed",
                    title: "Malformed",
                    status: 400,
                    detail: "cart item must have a quantity."
                })
            }
        }
    }

    targetUser.set("firstName", req.body.firstName ?? targetUser.get("firstName"));
    targetUser.set("middleName", req.body.middleName ?? targetUser.get("middleName"));
    targetUser.set("lastName", req.body.lastName ?? targetUser.get("lastName"));
    targetUser.set("email", req.body.email ?? targetUser.get("email"));
    if (req.body.cart !== undefined) {
        let cart = req.body.cart;
        let newCart: CartItemDao[] = [];
        for (let cartItem of cart) {
            let productId: string;
            if (typeof(cartItem.product) === 'string') {
                productId = cartItem.product;
            } else {
                productId = cartItem.product.id;
            }

            if (!await ProductModel.exists({ _id: productId })) {
                res.status(400).send({
                    type: "urn:100-project:error:malformed",
                    title: "Malformed",
                    status: 400,
                    detail: "cart item refers to a non-existent product."
                });
                return;
            }

            newCart.push({
                productId: new Types.ObjectId(productId),
                quantity: cartItem.quantity
            });
        }

        targetUser.set("cart", newCart);
    }
    await targetUser.save();

    const ret: User = {
        id: targetUser._id.toHexString(),
        firstName: targetUser.get("firstName"),
        middleName: targetUser.get("middleName"),
        lastName: targetUser.get("lastName"),
        email: targetUser.get("email"),
        isMerchant: targetUser.get("isMerchant")
    }

    if (targetUser.get("isMerchant")) {
        let productIds = targetUser.get("productIds");
        let results = await ProductModel.find({
            "_id": {
                $in: productIds
            }
        });

        ret.products = results.map((dao) => {
            return {
                id: dao._id.toHexString(),
                name: dao.name,
                description: dao.description,
                type: dao.type,
                quantity: dao.quantity,
                unitPrice: dao.unitPrice,
                unit: dao.unit,
                imageUrl: dao.imageUrl
            };
        });
    }

    let cart = targetUser.get("cart");
    if (cart === undefined) {
        ret.cart = [];
    } else {
        let cartQuantities = Object.fromEntries(cart.map((cartItem) => [cartItem.productId, cartItem.quantity]));
        let cartProducts = await ProductModel.find({
            _id: {
                $in: cart.map((cartItem) => cartItem.productId)
            }
        });

        ret.cart = cartProducts.map((product) => {
            return {
                product: {
                    id: product._id!.toHexString(),
                    name: product.name,
                    description: product.description,
                    type: product.type,
                    quantity: product.quantity,
                    unitPrice: product.unitPrice,
                    unit: product.unit,
                    imageUrl: product.imageUrl
                },
                quantity: cartQuantities[product._id!.toHexString()]
            }
        });
    }

    res.status(200).send(ret);
}

export async function deleteUser(req: Request, res: Response) {
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
    if (id !== tokenBody.id && !tokenBody.isAdmin) {
        res.status(403).send({
            type: "urn:100-project:error:forbidden",
            title: "Forbidden",
            status: 403,
            detail: "You do not have permission to delete this user."
        });
        return;
    }

    try {
        let user = await UserModel.findOne({
            _id: new Types.ObjectId(id),
            deleted: false
        });

        if (user === null) {
            res.status(404).send({
                type: "urn:100-project:error:not_found",
                title: "Not Found",
                status: 404,
                detail: "User not found."
            });
            return;
        }

        user.set("deleted", true);
        // Free the email address used by the account
        user.set("email", `${user.get("email")}-deleted-${Date.now()}`);
        await user.save();

        res.status(204).send();
    } catch (error) {
        res.status(500).send({
            type: "urn:100-project:error:internal",
            title: "Internal Server Error",
            status: 500,
            detail: "An error occured while deleting the user."
        });
        return;
    }
}
