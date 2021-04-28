// file system
import fs from 'fs';

// https://www.npmjs.com/package/xml2js ... npm i xml2js
import xml2js from 'xml2js';
import pa from './pa.js';

const diaryFolder = 'c:/data/life/diary/xml/';



// golbal data / repo 
// 
// p. ... did, mid, dd, mm, yyyy, tag, title, text
//
const pas = [];

/**
 * convert month (2016-12.xml) to list of pa objects and append it to pas[]
 *  
 * @param {*} month 
 */
const month2pas = function (month) {
    fs.readFile(diaryFolder + month, (err, data) => {
        if (err) {
            console.log("month " + month + " not found. " + err);
            return;
        }
        xml2js.parseString(data, function (err, result) {
            if (err) {
                console.log("month " + month + " not parsable..." + err);
                return;
            }
            var mid = 1;
            var d = JSON.stringify(result).replace('diary-month', 'diarymonth');
            var json = JSON.parse(d);
            json.diarymonth.day.forEach( day => {
                var did = 1;
                day.body[0].p.forEach(p => {
                    var title = p.$ != undefined && p.$.title != undefined ? p.$.title : '';
                    var tag   = p.$ != undefined && p.$.tag != undefined ? p.$.tag : '';
                    var text  = p._ != undefined ? p._.replace(/(?:\\[rn]|[\r\n]+)+/g, " ").trim() : '' // remove \r\n and trim
                    pas.push(new pa(did++, mid++, day.$.d, json.diarymonth.$.m, json.diarymonth.$.y, tag, title, text));
                });
            });
            console.log("loading " + month + " ... done, pa's:  (+" + (mid-1) + ") " + pas.length);
        });
    });
}

const initPas = function() {
    for(var yyyy=2015; yyyy<2017; yyyy++) {
        for(var mm=1; mm<=12; mm++) {
            var month = yyyy + "-" + (mm < 10 ? "0" : "") + mm + ".xml";
            console.log("load " + month);
            month2pas(month);
        }
    }
}

initPas();
// diaryJson("2016-08.xml");

export default pas;