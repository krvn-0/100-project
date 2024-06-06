import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { UserModel } from "../../models/user.js";
import { User, UserToken } from "../../entities/user.js";
import { ProductModel } from "../../models/product.js";
import { TokenManager } from "./secrets.js";


export async function login(req: Request, res: Response) {
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (typeof(email) !== 'string' || typeof(password) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "Email and password must be strings."
        });
        return;
    }

    const user = await UserModel.findOne({
        email: email,
        deleted: false
    });
    if (user === null) {
        res.status(401).send({
            type: "urn:100-project:error:wrong_login_credentials",
            title: "Wrong Login Credentials",
            status: 401,
            detail: "Incorrect email or password."
        });
        return;
    }

    if (!await bcrypt.compare(password, user.password)) {
        res.status(401).send({
            type: "urn:100-project:error:wrong_login_credentials",
            title: "Wrong Login Credentials",
            status: 401,
            detail: "Incorrect email or password."
        });
        return;
    }

    const ret: User = {
        id: user._id.toHexString(),
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        isMerchant: user.isMerchant,
    };

    if (user.isMerchant) {
        ret.products = [];
        for (let productId of user.productIds ?? []) {
            const product = await ProductModel.findById(productId);
            if (product === null) {
                continue;
            }
            ret.products.push({
                id: product._id!.toHexString(),
                name: product.name,
                description: product.description,
                type: product.type,
                quantity: product.quantity,
                unitPrice: product.unitPrice,
                unit: product.unit,
                imageUrl: product.imageUrl
            });
        }
    }

    let cart = user.get("cart");
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

    const tokenBody: UserToken = {
        id: user._id.toHexString(),
        isAdmin: user.isAdmin,
        isMerchant: user.isMerchant
    }

    const token = TokenManager.sign(tokenBody);
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).send(ret);
}

export async function logout(_: Request, res: Response) {
    res.cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
    });
    res.status(204).send();
}
