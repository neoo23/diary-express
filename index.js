import Express from "express";
import config from "./config.js"
import { filterPas, filterDays } from "./repo.js";
import { filterImages } from "./imagemeta.js";
import path from 'path';
import processImage from 'express-processimage';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://www.youtube.com/watch?v=JlgKybraoy4

const app = Express();

app.get("/:template/:yyyy/:mm/:dd/:tag", (req, res) => {
    var yyyymm = req.params.mm == "*" ? "*" : req.params.yyyy + req.params.mm;
    var images = filterImages(req.params.yyyy, yyyymm, req.params.dd, req.params.tag);
    var pas = filterPas(req.params.yyyy, req.params.mm, req.params.dd, req.params.tag);
    var days = filterDays(req.params.yyyy, req.params.mm, req.params.dd, req.params.tag);
    var templateData = {
        size: 350,
        params : req.params,
        pas: pas,
        days: days,
        images: images,
        imageSample : function () { return images.sample(); },
    }
    if (req.params.template == 'json') {
        res.json(templateData);
    }
    else {
        res.render(req.params.template, templateData);
    }
});

app.get("/hello", (req, res) => {
    res.render("index", { foo: 'bar'});
});

// npm install express-processimage
app.use(processImage({ root: config.images.imageFolder }))
  .use(Express.static(config.images.imageFolder));
//  .listen(1337);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(config.server.port, () => console.log("listen on port" + config.server.port));
