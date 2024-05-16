import { Request, Response } from "express";

import { ProductDOT, Product, UserDOT, User } from "../../entities.js";
import { products, users, userTokens } from "./data.js";

export function getUsers(req: Request, res: Response) {
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
    if (!userTokens.some(t => t.token === token)) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    let ret: User[] = users.map((user) => {
        let userProducts: Product[] | undefined = user.productIds?.map(id => {
            let product = products.find(p => p.id === id);
            if (product === undefined) {
                return undefined;
            }

            return {
                id: product.id,
                name: product.name,
                description: product.description,
                type: product.type,
                quantity: product.quantity,
                unitPrice: product.unitPrice
            };
        })?.filter(p => p !== undefined) as (Product[] | undefined);

        return {
            id: user.id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            email: user.email,
            isMerchant: user.isMerchant,
            products: (user.isMerchant && !userProducts) ? [] : userProducts
        };
    });

    res.status(200).send(ret)
}

export function createUser(req: Request, res: Response) {
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

    const firstName: string = req.body.firstName;
    const middleName: string | undefined = req.body.middleName;
    const lastName: string = req.body.lastName;
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (typeof(firstName) !== 'string' || (middleName !== undefined && typeof(middleName) !== 'string') || typeof(lastName) !== 'string' || typeof(email) !== 'string' || typeof(password) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed Request",
            status: 400,
            detail: "First name, middle name, last name, email, and password must be strings."
        });
        return;
    }

    if (users.find(u => u.email === email) !== undefined) {
        res.status(409).send({
            type: "urn:100-project:error:email_in_use",
            title: "Email Address In Use",
            status: 409,
            detail: "The email address is already in use."
        });
        return;
    }

    const id = Math.random().toString(16).substring(2, 14);

    users.push({
        id: id,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        password: password,
        isMerchant: false
    });

    res.status(201).send({
        id: id,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        isMerchant: false
    });
}

export function getUser(req: Request, res: Response) {
    const token = req.cookies?.token;

    if (token === undefined || !userTokens.some(t => t.token === token)) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    const id = req.params.id;
    const targetUser = users.find(u => u.id === id);

    if (targetUser === undefined) {
        res.status(404).send({
            type: "urn:100-project:error:user_not_found",
            title: "User Not Found",
            status: 404,
            detail: "The user does not exist."
        });
        return;
    }

    const currentUserId = userTokens.find(t => t.token === token)!.userId;
    const currentUser = users.find(u => u.id === currentUserId)!;

    if (currentUserId !== id && currentUser.isAdmin) {
        res.status(403).send({
            type: "urn:100-project:error:lacking_credentials",
            title: "Lacking Credentials",
            status: 403,
            detail: "You do not have permission to view this user."
        });
        return;
    }

    res.status(200).send({
        id: targetUser.id,
        firstName: targetUser.firstName,
        middleName: targetUser.middleName,
        lastName: targetUser.lastName,
        email: targetUser.email,
        isMerchant: targetUser.isMerchant,
        products: targetUser.productIds?.map?.(id => {
            let product = products.find(p => p.id === id);
            if (product === undefined) {
                return undefined;
            }

            delete product.ownerId
            return product
        }).filter(p => p !== undefined) as (Product[] | undefined)
    });
}

export function updateUser(req: Request, res: Response) {
    const token = req.cookies?.token;

    if (token === undefined || !userTokens.some(t => t.token === token)) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    const id = req.params.id;
    const targetUser = users.find(u => u.id === id);

    if (targetUser === undefined) {
        res.status(404).send({
            type: "urn:100-project:error:user_not_found",
            title: "User Not Found",
            status: 404,
            detail: "The user does not exist."
        });
        return;
    }

    const currentUserId = userTokens.find(t => t.token === token)!.userId;
    const currentUser = users.find(u => u.id === currentUserId)!;

    if (currentUserId !== id && currentUser.isAdmin) {
        res.status(403).send({
            type: "urn:100-project:error:lacking_credentials",
            title: "Lacking Credentials",
            status: 403,
            detail: "You do not have permission to edit this user."
        });
        return;
    }

    const firstName: string | undefined = req.body.firstName;
    const middleName: string | undefined = req.body.middleName;
    const lastName: string | undefined = req.body.lastName;
    const email: string | undefined = req.body.email;

    targetUser.firstName = firstName ?? targetUser.firstName;
    targetUser.middleName = middleName ?? targetUser.middleName;
    targetUser.lastName = lastName ?? targetUser.lastName;
    targetUser.email = email ?? targetUser.email;

    res.status(200).send({
        id: targetUser.id,
        firstName: targetUser.firstName,
        middleName: targetUser.middleName,
        lastName: targetUser.lastName,
        email: targetUser.email,
        isMerchant: targetUser.isMerchant,
        products: targetUser.productIds?.map?.(id => {
            let product = products.find(p => p.id === id);
            if (product === undefined) {
                return undefined;
            }

            delete product.ownerId
            return product
        }).filter(p => p !== undefined) as (Product[] | undefined)
    });
}

export function deleteUser(req: Request, res: Response) {
    const token = req.cookies?.token;

    if (token === undefined || !userTokens.some((entry) => entry.token === token)) {
        res.status(401).send({
            type: "urn:100-project:error:not_logged_in",
            title: "Not Logged In",
            status: 401,
            detail: "You are not logged in."
        });
        return;
    }

    const id = req.params.id;
    const targetUser = users.find((user) => user.id === id);

    if (!targetUser) {
        res.status(404).send({
            type: "urn:100-project:error:user_not_found",
            title: "User Not Found",
            status: 404,
            detail: "The user does not exist."
        });
        return;
    }

    const currentUserId = userTokens.find((entry) => entry.token === token)!.userId;
    const currentUser = users.find((user) => user.id === currentUserId)!;

    if (currentUser.id !== targetUser.id && !currentUser.isAdmin) {
        res.status(403).send({
            type: "urn:100-project:error:lacking_credentials",
            title: "Lacking Credentials",
            status: 403,
            detail: "You do not have permission to delete this user."
        });
        return;
    }

    if (currentUser.id === targetUser.id) {
        // Discard the token if the user is currently logged in as the user to be deleted.
        res.cookie("token", "", {
            maxAge: 0,
            httpOnly: true
        });
    }
    users.splice(users.indexOf(targetUser), 1);

    res.status(204).send();
}


