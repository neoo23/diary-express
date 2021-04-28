import Express from "express";
import config from "./config.js"
import pas from "./pas.js";
import pa from "./pa.js";


// https://www.youtube.com/watch?v=JlgKybraoy4

const app = Express();

app.get("/pas-all", (req, res) => {
    res.send(JSON.stringify(pas));
});

app.get("/pas/:yyyy/:mm/:dd/:tag", (req, res) => {
    res.json(pas.filter((pa) => {
        var y = req.params.yyyy == '*' || req.params.yyyy === pa.yyyy;
        var m = req.params.mm == '*' || req.params.mm === pa.mm;
        var d = req.params.dd == '*' || req.params.dd === pa.dd;
        var t = req.params.tag == '*' || pa.tag.indexOf(req.params.tag) > -1;
        return y && m && d && t;
    }))
});

app.listen(config.server.port, () => console.log("listen on port" + config.server.port));
