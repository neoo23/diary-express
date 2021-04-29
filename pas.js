// file system
import fs from 'fs';

// https://www.npmjs.com/package/xml2js ... npm i xml2js
import xml2js from 'xml2js';
import pa from './pa.js';
import day from './day.js';
import config from "./config.js"

// golbal data / repo 
// 
// p. ... did, mid, dd, mm, yyyy, tag, title, text
//
const pas = [];
const days = [];

/**
 * convert month (2016-12.xml) to list of pa objects and append it to pas[]
 *  
 * @param {*} month 
 */
const month2pas = function (month) {
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
            var mid = 1;
            var d = JSON.stringify(result).replace('diary-month', 'diarymonth');
            var json = JSON.parse(d);
            json.diarymonth.day.forEach( d => {
                var did = 1;
                var pas_ = [];
                d.body[0].p.forEach(p => {
                    var title = p.$ != undefined && p.$.title != undefined ? p.$.title : '';
                    var tag   = p.$ != undefined && p.$.tag != undefined ? p.$.tag : '';
                    var text  = p._ != undefined ? p._.replace(/(?:\\[rn]|[\r\n]+)+/g, " ").trim() : '' // remove \r\n and trim
                    var pa_ = new pa(did++, mid++, d.$.d, json.diarymonth.$.m, json.diarymonth.$.y, tag, title, text);
                    pas.push(pa_);
                    pas_.push(pa_);
                });
                if( d.kiten != undefined) {
                    var k = d.kiten[0];
                    console.log(JSON.stringify(k));
                    var title_ = (k.$.title + ", " + k.$.spot + ", " + k.$.time + ", " + k.$.boards + ", " + k.$.kites + ", " + k.$.wind + ", " + k.$.fun);
                    var pa_ = new pa(did++, mid++, d.$.d, json.diarymonth.$.m, json.diarymonth.$.y, "kitesession", title_, "");
                    pas.push(pa_);
                    pas_.push(pa_);
                }
                var day_ = new day(dayid++, d.$.d, json.diarymonth.$.m, json.diarymonth.$.y, d.$.title, pas_);
                days.push(day_);
            });
            console.log("loading " + month + " ... done, pa's:  (+" + (mid-1) + ") " + pas.length);
        });
    });
}

const initPas = function() {
    console.log("loading " + config.pas.repoStartYear + " - " + config.pas.repoEndYear);
    for(var yyyy=config.pas.repoStartYear; yyyy <= config.pas.repoEndYear; yyyy++) {
        for(var mm=1; mm<=12; mm++) {
            var month = yyyy + "-" + (mm < 10 ? "0" : "") + mm + ".xml";
            console.log("load " + month);
            month2pas(month);
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
        if ( tag != '*' && ! d.pas.find( (p) => { return p.tag.indexOf(tag) != -1 }) ) return false;
        return true;
    });
}

// a day is an [] of pas ... day[dd_mm_yyyy] => pa[]
export const pas2days = function(pas) {
    var days = {};
    pas.forEach( (pa) => {
        if ( days[pa.dd_mm_yyyy()] == undefined ) {
            days[pa.dd_mm_yyyy()] = [];
        }
        days[pa.dd_mm_yyyy()].push(pa);
    });
    return days;
}

initPas();
// diaryJson("2016-08.xml");

export default pas;