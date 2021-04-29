// file system
import fs from 'fs';

import config from "./config.js";

var images = [];

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = function (dir, filelist) {
    var files = fs.readdirSync(config.images.imageFolder + dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(config.images.imageFolder + dir + file).isDirectory()) {
            filelist = walkSync(dir + file + '/', filelist);
        }
        else {
            var imagePath = dir + file;
            filelist.push(imagePath);
        }
    });
    return filelist;
};

const initImages = function() {
    console.log("loading images " + config.pas.repoStartYear + " - " + config.pas.repoEndYear);
    for(var yyyy=config.pas.repoStartYear; yyyy <= config.pas.repoEndYear; yyyy++) {
        for(var mm=1; mm<=12; mm++) {
            var yyyy_yyyymm_ = yyyy + "/" + yyyy + (mm < 10 ? "0" : "") + mm + "/";
            var imgs = walkSync(yyyy_yyyymm_, []);
            // add all image pathes to global array
            images = images.concat(imgs);
            // some logging
            console.log("load images in " + yyyy_yyyymm_ + " ... done, image's: (+" + imgs.length + ") " + images.length);
        }
    }
}

initImages();

export default images;