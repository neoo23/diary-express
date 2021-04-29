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

export const filterImages = function(yyyy_, mm_, dd_, namefilter_) {
    var imgs = images.filter((img) => {
        var yyyy = img.substring(0,4);
        if ( yyyy_ != '*' && yyyy_ != yyyy ) return false;
        var mm = img.substring(5,11);
        if ( mm_ != '*' && mm_ != mm ) return false;
        var di = img.lastIndexOf("/");
        var dd = img.substring(di+7, di+9);
        if ( dd_ != '*' && dd_ != dd ) return false;
        var n = img.substring(21);
        // if ( namefilter_ != '*' && n.indexOf(namefilter_) == -1 ) return false;
        // any match in array
        if ( namefilter_ != '*' && ! tags2array(namefilter_).find( (e) => { return n.indexOf(e) != -1 }) ) return false;
        return true;
    });
    console.log("images: " + yyyy_ + " " + mm_ + " " + dd_ + " " + namefilter_ + " ... " + imgs.length);
    return imgs;
}

const tags2array = function( tag ) {
    if (tag == 'family') {
        return ['hgw', 'hwi', 'greifswald', 'wismar', 'barth', 'bartling', 'barthling', 'volker', 'mutti', 'karin', 'gunda'];
    }
    if (tag == 'kiten' || tag == 'kitesession') {
        return ['kiten', 'kites', 'pepelow']
    }
    return [ tag ];
}

initImages();

export default images;