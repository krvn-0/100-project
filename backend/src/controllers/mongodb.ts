import { Express } from "express";
import mongoose from "mongoose";
import { login, logout } from "./mongodb/authorization.js";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "./mongodb/users.js";

export default async function RouteWithMongoDB(app: Express) {
    await mongoose.connect(
        process.env.DB_URI!,
        {
            dbName: process.env.DB_NAME,
            auth: {
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD
            }
        }
    ).then((value) => {
        console.log(`Connected to MongoDB: ${value.connection.name}`);
    });

    app.post("/login", login);
    app.post("/logout", logout);

    app.get("/users", getUsers);
    app.put("/users", createUser);
    app.get("/users/:id", getUser);
    app.patch("/users/:id", updateUser);
    app.delete("/users/:id", deleteUser);
}