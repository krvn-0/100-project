import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = parseInt(process.env.BACKEND_PORT || '3001', 10);
if (isNaN(port)) {
    throw new Error("PORT environment variable is not a number");
}

// Add request console logger
app.use((req, res, next) => {
    console.log(`Received ${req.method} request: ${req.url}`);
    console.log(`Origin: ${req.headers.origin}`);
    console.log(`Authorization: ${req.headers.authorization}`);
    console.log(`Body: ${typeof req.body === 'object' ? JSON.stringify(req.body) : req.body}`);

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
