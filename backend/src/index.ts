import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import { RouteWithInternalData } from './routers.js';

const app = express();
const port = parseInt(process.env.BACKEND_PORT || '3001', 10);
if (isNaN(port)) {
    throw new Error("PORT environment variable is not a number");
}

app.use(express.json({
    strict: true
}));
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

// Add request console logger
app.use((req, res, next) => {
    console.log("==============")
    console.log(`Received ${req.method} request: ${req.url}`);
    console.log(`Origin: ${req.headers.origin}`);
    console.log(`Authorization: ${req.headers.authorization}`);
    console.log(`Body: ${typeof req.body === 'object' ? JSON.stringify(req.body) : req.body}`);
    console.log(`Cookies: ${JSON.stringify(req.cookies)}`);

    next();
});

// Set up CORS middleware
app.use((req, res, next) => {
    let frontendPort = 3000;
    let allowedOrigins = [`http://localhost:${frontendPort}`];

    if (req.headers.origin && allowedOrigins.includes(req.headers.origin)) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', "true");
        res.setHeader('Access-Control-Allow-Methods', "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    }

    next();
});

RouteWithInternalData(app);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

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
})

app.listen(port, () => {
    console.log(`Backend server started on port ${port}.`);
});
