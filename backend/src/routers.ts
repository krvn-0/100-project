import { Express } from "express";

import { createUser, getUser, getUsers, login, logout } from "./controllers/internal_data.js";
import { deleteUser, updateUser } from "./controllers/internal_data/users.js";
import { createTransaction, getTransactions, updateTransaction } from "./controllers/mongodb/transactions.js";

export function RouteWithInternalData(app: Express) {
    app.post('/login', login);
    app.post('/logout', logout);

    app.get("/users", getUsers);
    app.put("/users", createUser);
    app.get("/users/:id", getUser);
    app.patch("/users/:id", updateUser);
    app.delete("/users/:id", deleteUser);

    app.get("/transactions", getTransactions);
    app.put("/transactions", createTransaction);
    app.patch("/transactions/:id", updateTransaction);
}
