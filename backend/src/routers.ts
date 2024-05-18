import { Express } from "express";

import { createUser, getUser, getUsers, login, logout } from "./controllers/internal_data.js";
import { deleteUser, updateUser } from "./controllers/internal_data/users.js";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "./controllers/internal_data/products.js";

export function RouteWithInternalData(app: Express) {
    app.post('/login', login);
    app.post('/logout', logout);

    app.get("/users", getUsers);
    app.put("/users", createUser);
    app.get("/users/:id", getUser);
    app.patch("/users/:id", updateUser);
    app.delete("/users/:id", deleteUser);

    app.get("/products/:id", getProduct);
    app.get("/products", getProducts);
    app.put("/products", createProduct);
    app.patch("/products/:id", updateProduct);
    app.delete("/products/:id", deleteProduct);
}
