import Express from "express";
import config from "./config.js"
import { filterPas, filterDays, initRepo, daysCount, pasCount } from "./repo.js";
import images, { filterImages, initImages, imagesCount } from "./imagemeta.js";
import path from 'path';
import processImage from 'express-processimage';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://www.youtube.com/watch?v=JlgKybraoy4

// commandline, start params 
var myArgs = process.argv.slice(2);
var startYYYY =  myArgs[0];
var endYYYY =  myArgs[1];
if (startYYYY != undefined && endYYYY == undefined) {
    endYYYY = startYYYY;
}
startYYYY =  startYYYY == undefined ? config.pas.repoStartYear : startYYYY;
endYYYY =  endYYYY == undefined ? config.pas.repoEndYear : endYYYY;

// setup diary data ... month xml, images
initRepo(startYYYY, endYYYY);
initImages(startYYYY, endYYYY);

const app = Express();

app.get("/:template/:yyyy/:mm/:dd/:tag", (req, res) => {
    var yyyymm = req.params.mm == "*" ? "*" : req.params.yyyy + req.params.mm;
    var images = filterImages(req.params.yyyy, yyyymm, req.params.dd, req.params.tag);
    var pas = filterPas(req.params.yyyy, req.params.mm, req.params.dd, req.params.tag);
    var days = filterDays(req.params.yyyy, req.params.mm, req.params.dd, req.params.tag);
    // finde image for day
    days.forEach( (d) => { 
        d.img = filterImages(d.yyyy, d.yyyy + d.mm, d.dd, "_best", images).sample();  // _best in image_name
        if (d.img == undefined || d.img == "") {
            d.img = filterImages(d.yyyy, d.yyyy + d.mm, d.dd, "_b", images).sample(); // _b in image_name
        }
        if (d.img == undefined || d.img == "") {
            d.img = filterImages(d.yyyy, d.yyyy + d.mm, d.dd, "_d", images).sample(); // _d in image_name
        }
        if (d.img == undefined || d.img == "") {
            d.img = filterImages(d.yyyy, d.yyyy + d.mm, d.dd, "*", images).sample();
        }
    } );
    // queryUri
    var queryUri = ""; 
    for ( var p in req.query ) { queryUri += ((queryUri.length < 1  ? '?' : '&') + p + "=" + req.query[p]) };
    // template data {}
    var templateData = {
        size: 350,
        params : req.params,
        query: req.query, // in .ejs template > query.<columns>
        queryUri : queryUri,
        pas: pas,
        days: days,
        images: images,
        imageSample : function () { return images.sample(); },
        urlSelects : {
            template : ['imagethumbs', 'days-list', 'days-details', 'pas-list', 'pas-details'],
            tag: ['*', '_b', '_best', 'kiten', 'kitesession', 'mum', 'money', 'news', 'family', 'friends', 'garten', 'movie', 'it_', 'dinge',
                'game', 'pokern', 'work', 'arzt', 'auto', 'sport', 'bad', 'buch', 'urlaub', 'music', 'recap', 'graffiti', 'fpv',
                'selfimpr', 'wowa', 'bike', 'monthary', 'wissen', 'whg'],
            yyyy: ['*', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'],
            mm: ['*', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dd: ['*', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
        },
        urlSelected : function (opt, type) { return req.params[type] == opt ? "selected" : "" },
        repo : { startYYYY: startYYYY, endYYYY: endYYYY, days : daysCount(), pas : pasCount(), images: imagesCount() }
    }
    // processing: render or json output
    if (req.params.template == 'json') {
        // for json data check ... http.rest
        res.json(templateData);
    }
    else {
        // forward to main.ejs where params.template is included
        res.render("main", templateData);
    }
});

app.get("/", (req, res) => {
    res.redirect("/days-list/" + startYYYY + "/01/*/*");
});

// npm install express-processimage
app.use(processImage({ root: config.images.imageFolder }))
  .use(Express.static(config.images.imageFolder));
//  .listen(1337);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(config.server.port, () => console.log("listen on port" + config.server.port));
