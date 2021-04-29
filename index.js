import Express from "express";
import config from "./config.js"
import pas from "./pas.js";
import pa from "./pa.js";
import images from "./imagemeta.js";


// https://www.youtube.com/watch?v=JlgKybraoy4

const app = Express();

app.get("/pas-all", (req, res) => {
    res.send(JSON.stringify(pas));
});

app.get("/pas/:yyyy/:mm/:dd/:tag", (req, res) => {
    res.json(pas.filter((pa) => {
        if ( req.params.yyyy != '*' && req.params.yyyy != pa.yyyy ) return false;
        if ( req.params.mm != '*' && req.params.mm != pa.mm ) return false;
        if ( req.params.dd != '*' && req.params.dd != pa.dd ) return false;
        if ( req.params.tag != '*' && pa.tag.indexOf(req.params.tag) == -1 ) return false;
        return true;
    }))
});

app.get("/imagemeta/:yyyy/:mm/:dd/:namefilter", (req, res) => {
    var imgs = images.filter((img) => {
        var yyyy = img.substring(0,4);
        if ( req.params.yyyy != '*' && req.params.yyyy != yyyy ) return false;
        var mm = img.substring(5,11);
        if ( req.params.mm != '*' && req.params.mm != mm ) return false;
        var dd = img.substring
        if ( req.params.dd != '*' && req.params.dd != dd ) return false;
        var n = img.substring(21);
        if ( req.params.namefilter != '*' && n.indexOf(req.params.namefilter) == -1 ) return false;
        return true;
    });
    res.json(imgs.sample()); // sample() see config.js
});

app.listen(config.server.port, () => console.log("listen on port" + config.server.port));
