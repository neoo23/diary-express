// file system
import fs from 'fs';

// https://www.npmjs.com/package/xml2js ... npm i xml2js
import xml2js from 'xml2js';

import pa from './pa.js';
import day from './day.js';
import config from "./config.js"

// ===============================================
// golbal data / repo ... pas[pa.js], days[day.js]
// 
const pas = [];
const days = [];
// ===============================================



/**
 * convert month (2016-12.xml) to list of pa objects and append it to pas[]
 *  
 * @param {*} month 
 */
export const month2repo = function (month) {
    fs.readFile(config.pas.diaryFolder + month, (err, data) => {
        if (err) {
            console.log("month " + month + " not found. " + err);
            return;
        }
        xml2js.parseString(data, function (err, result) {
            if (err) {
                console.log("month " + month + " not parsable..." + err);
                return;
            }
            var dayid = 1;
            var paid = 1;
            var d = JSON.stringify(result).replace('diary-month', 'diarymonth');
            var json = JSON.parse(d);
            json.diarymonth.day.forEach( d => {
                var did = 1;
                var pas_ = [];
                var kitentext = "";
                d.body[0].p.forEach(p => {
                    var title = p.$ != undefined && p.$.title != undefined ? p.$.title : '';
                    var tag   = p.$ != undefined && p.$.tag != undefined ? p.$.tag : '';
                    var text  = p._ != undefined ? p._.replace(/(?:\\[rn]|[\r\n]+)+/g, " ").replace(/\/\//g, "</p>").trim() : '' // remove \r\n and trim
                    var pa_ = new pa(did++, paid++, d.$.d, json.diarymonth.$.m, json.diarymonth.$.y, tag, title, text);
                    pas.push(pa_);
                    pas_.push(pa_);
                    // find text for tag="kiten" for <kiten...> element => pa 
                    kitentext = tag.indexOf("kiten") != -1 ? text : kitentext;
                });
                if( d.kiten != undefined) {
                    d.kiten.forEach(k => {
                        var title_ = (k.$.title + ", " + k.$.spot + ", " + k.$.time + ", " + k.$.boards + ", " + k.$.kites + ", " + k.$.wind + ", " + k.$.fun);
                        var pa_ = new pa(did++, paid++, d.$.d, json.diarymonth.$.m, json.diarymonth.$.y, "kitesession", title_, kitentext);
                        pas.push(pa_);
                        pas_.push(pa_);
                    });
                }
                var day_ = new day(dayid++, d.$.d, json.diarymonth.$.m, json.diarymonth.$.y, d.$.title, pas_);
                days.push(day_);
            });
            console.log("loading " + month + " into repo ... pas: +" + (paid-1) + "/" + pas.length + ", days: +" + (dayid-1) + "/" + days.length);
        });
    });
}

export const initRepo = function(startYYYY, endYYYY) {
    console.log("loading " + config.pas.repoStartYear + " - " + config.pas.repoEndYear);
    var startYYYY_ =  startYYYY == undefined ? config.pas.repoStartYear : startYYYY;
    var endYYYY_ =  endYYYY == undefined ? config.pas.repoEndYear : endYYYY;
    for(var yyyy=startYYYY_; yyyy <= endYYYY_; yyyy++) {
        for(var mm=1; mm<=12; mm++) {
            var month = yyyy + "-" + (mm < 10 ? "0" : "") + mm + ".xml"; // yyyy-mm.xml
            console.log("load " + month);
            month2repo(month);
            // PROBLEM: unsorted results because, asyn processing of fs.readFile(...)
            // TODO: convert to recursion
            // so month2repo call month2repo again for next month until all months processed, so no sorting neccessary!
            // here: build month[] than call month2repo(months[]), process first element, recurse with rest until empty. 
        }
    }
}

export const filterPas = function(yyyy, mm, dd, tag) {
    return pas.filter((pa) => {
        if ( yyyy != '*' && yyyy != pa.yyyy ) return false;
        if ( mm != '*' && mm != pa.mm ) return false;
        if ( dd != '*' && dd != pa.dd ) return false;
        if ( tag != '*' && pa.tag.indexOf(tag) == -1 ) return false;
        return true;
    });
}

export const filterDays = function(yyyy, mm, dd, tag) {
    return days.filter((d) => {
        if ( yyyy != '*' && yyyy != d.yyyy ) return false;
        if ( mm != '*' && mm != d.mm ) return false;
        if ( dd != '*' && dd != d.dd ) return false;
        // when tag only days with pas with this tag
        if ( tag != '*' && ! d.pas.find( (p) => { return p.tag.indexOf(tag) != -1 }) ) return false;
        return true;
    });
}

export const daysCount = function() { return days.length; }
export const pasCount = function() { return pas.length; }
