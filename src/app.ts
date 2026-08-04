import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();

const PORT = 3000;

app.use(express.static("public", { index: ["index.html", "styles.css", "script.js"] }));

app.listen(PORT);
console.log(`Server listening on port: ${PORT}...`)
