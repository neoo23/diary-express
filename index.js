import Express from "express";
import Products from "./products.js";

// https://www.youtube.com/watch?v=JlgKybraoy4

const app = Express();
const port = 3000;

app.get("/products", (req, res) => {
    res.send(Products);
});

app.get("/products/:id", (req, res) => {
    // res.send(Products);
    res.json(Products.find((p) => {
        return +req.params.id === p.id;
    }))
});

app.listen(port, () => console.log("listen on port" + port));
