import { Request, Response } from 'express';

import { products, userTokens, users } from './data.js';
import { Product, User } from '../../entities.js';

function generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function login(req: Request, res: Response) {
    let token = req.cookies?.token;
    if (token !== undefined && userTokens.some(t => t.token === token)) {
        res.status(409).send({
            type: "urn:100-project:error:already_logged_in",
            title: "Already Logged In",
            status: 409,
            detail: "You are already logged in."
        });
        return;
    }

    const { email, password } = req.body;

    if (typeof(email) !== 'string' || typeof(password) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "Email and password must be strings."
        });
        return;
    }

    const user = users.find(u => u.email === email);
    if (user === undefined) {
        res.status(401).send({
            type: "urn:100-project:error:wrong_login_credentials",
            title: "Wrong Login Credentials",
            status: 401,
            detail: "Incorrect email or password."
        });
        return;
    }

    if (user.password !== password) {
        res.status(401).send({
            type: "urn:100-project:error:wrong_login_credentials",
            title: "Wrong Login Credentials",
            status: 401,
            detail: "Incorrect email or password."
        });
        return;
    }

    const ret: User = {
        id: user.id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        isMerchant: user.isMerchant,
        products: user.productIds?.map?.(id => {
            let product = products.find(p => p.id === id);
            if (product === undefined) {
                return undefined;
            }

            delete product.ownerId
            return product
        }).filter(p => p !== undefined) as Product[]
    }

    token = generateToken();
    userTokens.push({
        userId: user.id,
        token
    });

    res.setHeader("Set-Cookie", `token=${token}; HttpOnly`);
    res.status(200).send(ret);
}

export function logout(req: Request, res: Response) {
    const token = req.cookies?.token;
    if (token === undefined) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    const tokenIndex = userTokens.findIndex(t => t.token === token);
    if (tokenIndex === -1) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    userTokens.splice(tokenIndex, 1);

    res.setHeader("Set-Cookie", `token=; HttpOnly`);
    res.status(204).send();
}