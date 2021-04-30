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
    // finde image for day
    days.forEach( (d) => { 
        d.img = filterImages(d.yyyy, d.yyyy + d.mm, d.dd, "_best", images).sample();
        if (d.img == undefined || d.img == "") {
            d.img = filterImages(d.yyyy, d.yyyy + d.mm, d.dd, "_b", images).sample();
        }
        if (d.img == undefined || d.img == "") {
            d.img = filterImages(d.yyyy, d.yyyy + d.mm, d.dd, "*", images).sample();
        }
    } );
    var templateData = {
        size: 350,
        params : req.params,
        query: req.query, // in .ejs template > query.<columns>
        pas: pas,
        days: days,
        images: images,
        imageSample : function () { return images.sample(); },
        urlSelects : {
            template : ['imagethumbs', 'days-list', 'days-details', 'pas-list', 'pas-details'],
            tag: ['*', 'kiten', 'kitesession', 'family', 'garten'],
            yyyy: ['*', '2021', '2020', '2019', '2018'],
            mm: ['*', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dd: ['*']
        },
        urlSelected : function (opt, type) { return req.params[type] == opt ? "selected" : "" },
    }
    if (req.params.template == 'json') {
        // for json data check ... http.rest
        res.json(templateData);
    }
    else {
        // forward to main.ejs where params.template is included
        res.render("main", templateData);
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
