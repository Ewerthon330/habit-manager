import express from 'express';

const app = express();
const port = 3002;

app.listen(port, () => {
    console.log(`Test server running on port ${port}`);
});
