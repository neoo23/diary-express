// file system
import fs from 'fs';

import config from "./config.js";

var images = [];

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = function (dir, filelist) {
    if (!fs.existsSync(config.images.imageFolder + dir)) {
        return [];
    }
    var files = fs.readdirSync(config.images.imageFolder + dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(config.images.imageFolder + dir + file).isDirectory()) {
            if (filterOutImageDir(file)) {
                console.log("filter out dir: " + file);
            }
            else {
                filelist = walkSync(dir + file + '/', filelist);
            }
        }
        else {
            var imagePath = dir + file;
            filelist.push(imagePath);
        }
    });
    return filelist;
};

const filterOutImageDir = function (dir) {
    // add the image folders witch should be ignored here !!! 
    var filter = [
        '20210601 [andy] sprunggelenk bruch',
        '20210717 [maike] shooting'
    ];
    return filter.includes(dir) || (dir + '').indexOf('nid]') > 0; // nid - not in dairy tag
}

export const initImages = function (startYYYY, endYYYY) {
    console.log("loading images " + startYYYY + " - " + endYYYY);
    for(var yyyy=startYYYY; yyyy <= endYYYY; yyyy++) {
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

export const filterImages = function(yyyy_, mm_, dd_, tags, images_) {
    var imgs = (images_ == undefined ? images : images_).filter((img) => {
        var yyyy = img.substring(0,4);
        if ( yyyy_ != '*' && yyyy_ != yyyy ) return false;
        var mm = img.substring(5,11);
        if ( mm_ != '*' && mm_ != mm ) return false;
        var di = img.lastIndexOf("/");
        var dd = img.substring(di+7, di+9);
        if ( dd_ != '*' && dd_ != dd ) return false;
        var n = img.substring(21);
        var tagsEvery = tags2arrayEvery(tags);
        if (tagsEvery.length > 1) {
            // every match in array
            if ( ! tagsEvery.every( (e) => { return n.indexOf(e) != -1 }) ) return false;
        } 
        else {
            // any match in array
            if ( tags != '*' && ! tags2array(tags).find( (e) => { return n.indexOf(e) != -1 }) ) return false;
        }
        return true;
    });
    console.log("images: " + yyyy_ + " " + mm_ + " " + dd_ + " " + tags + " ... " + imgs.length);
    return imgs;
}


const tags2arrayEvery = function( tag ) {
    var r = tag.split("+");
    if ( r.length > 1) {
        return r;
    }
    return [];
}

const tags2array = function( tag ) {
    var r = tag.split(",");
    if ( r.length > 1) {
        return r;
    }
    if (tag == 'family') {
        return ['hgw', 'hwi', 'greifswald', 'wismar', 'barth', 'bartling', 'barthling', 'volker', 'mutti', 'karin', 'gunda'];
    }
    if (tag == 'kiten' || tag == 'kitesession') {
        return ['kiten', 'kites']
    }
    return [ tag ];
}

export const imagesCount = function() { return images.length; }

export default images;