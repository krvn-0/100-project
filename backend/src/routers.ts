import { Express } from "express";

import { login, logout } from "./controllers/internal_data.js";

export function RouteWithInternalData(app: Express) {
    app.post('/login', login)
    app.post('/logout', logout);
}
