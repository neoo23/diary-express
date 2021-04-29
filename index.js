import Express from "express";
import config from "./config.js"
import pas from "./pas.js";
import { filterPas } from "./pas.js";
import pa from "./pa.js";
import images from "./imagemeta.js";
import { filterImages } from "./imagemeta.js";
import path from 'path';
import processImage from 'express-processimage';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://www.youtube.com/watch?v=JlgKybraoy4

const app = Express();

app.get("/pas-all", (req, res) => {
    res.send(JSON.stringify(pas));
});

app.get("/pas-json/:yyyy/:mm/:dd/:tag", (req, res) => {
    res.json(filterPas(req.params.yyyy, req.params.mm, req.params.dd, req.params.tag))
});

app.get("/pas/:template/:yyyy/:mm/:dd/:tag", (req, res) => {
    var yyyymm = req.params.mm == "*" ? "*" : req.params.yyyy + req.params.mm;
    var images_ = filterImages(req.params.yyyy, yyyymm, req.params.dd, req.params.tag);
    res.render("pas_" + req.params.template, {
        size: 350,
        params : req.params,
        pas: filterPas(req.params.yyyy, req.params.mm, req.params.dd, req.params.tag),
        images: images_,
        imageSample : function () { return images_.sample(); },
    });
});

app.get("/imagemeta/:yyyy/:mm/:dd/:namefilter", (req, res) => {
    var imgs = filterImages(req.params.yyyy, req.params.mm, req.params.dd, req.params.namefilter);
    // res.json(imgs.sample()); // sample() see config.js
    res.json(imgs);
});

app.get("/imagethumbs/:yyyy/:mm/:dd/:namefilter/:size", (req, res) => {
    res.render("imagethumbs", {
        size: req.params.size,
        images: filterImages(req.params.yyyy, req.params.mm, req.params.dd, req.params.namefilter)
    });
});

app.get("/", (req, res) => {
    res.render("index", { foo: 'bar'});
});

// bind imagefolder to images/... uri
// app.use('/images', Express.static(config.images.imageFolder));

// npm install express-processimage
app.use(processImage({ root: config.images.imageFolder }))
  .use(Express.static(config.images.imageFolder));
//  .listen(1337);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(config.server.port, () => console.log("listen on port" + config.server.port));
