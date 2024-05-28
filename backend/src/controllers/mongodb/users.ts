import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, UserDAO, UserToken } from "../../entities/user.js";
import { TokenSecretManager } from "./secrets.js";
import { UserModel } from "../../models/user.js";

export async function getUsers(req: Request, res: Response) {
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

    let userDaos;
    if (tokenBody.isAdmin) {
        userDaos = await UserModel.find();
    } else {
        userDaos = await UserModel.find({ _id: tokenBody.id });
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
            user.products = [];
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

    if (typeof(firstName) !== 'string' || (middleName !== undefined && typeof(middleName) !== 'string') || typeof(lastName) !== 'string' || typeof(email) !== 'string' || typeof(password) !== 'string') {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Bad Request",
            status: 400,
            detail: "First name, middle name (optional), last name, email, and password must be strings."
        });
        return;
    }

    if (await UserModel.exists({email: email})) {
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

    const id = req.params.id;
    const targetUser = await UserModel.findById(id);

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
        // TODO: Create products model
        ret.products = [];
    }

    res.status(200).send(ret);
}

export async function updateUser(req: Request, res: Response) {
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

    const targetUser = await UserModel.findById(id);
    if (targetUser === null) {
        res.status(404).send({
            type: "urn:100-project:error:user_not_found",
            title: "User Not Found",
            status: 404,
            detail: "The user does not exist."
        });
        return;
    }

    targetUser.set("firstName", req.body.firstName ?? targetUser.get("firstName"));
    targetUser.set("middleName", req.body.middleName ?? targetUser.get("middleName"));
    targetUser.set("lastName", req.body.lastName ?? targetUser.get("lastName"));
    targetUser.set("email", req.body.email ?? targetUser.get("email"));
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
        // TODO: Create products model
        ret.products = [];
    }

    res.status(200).send(ret);
}

export async function deleteUser(req: Request, res: Response) {
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

    if (await UserModel.findByIdAndDelete(id)) {
        if (id === tokenBody.id) {
            res.cookie("token", "", {expires: new Date(0)});
        }
        res.status(204).send();
    } else {
        res.status(404).send({
            type: "urn:100-project:error:user_not_found",
            title: "User Not Found",
            status: 404,
            detail: "The user does not exist."
        });
    }
}
