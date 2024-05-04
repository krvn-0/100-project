import express from 'express';

const app = express();
const port = parseInt(process.env.BACKEND_PORT || '3001', 10);
if (isNaN(port)) {
    throw new Error("PORT environment variable is not a number");
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Backend server started on port ${port}.`);
});
