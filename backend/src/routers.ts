import { Express } from "express";

import { createUser, getUser, getUsers, login, logout } from "./controllers/internal_data.js";
import { deleteUser, updateUser } from "./controllers/internal_data/users.js";

export function RouteWithInternalData(app: Express) {
    app.post('/login', login);
    app.post('/logout', logout);

    app.get("/users", getUsers);
    app.put("/users", createUser);
    app.get("/users/:id", getUser);
    app.patch("/users/:id", updateUser);
    app.delete("/users/:id", deleteUser);
}
