import { month2repo } from "./repo.js";
import config from "./config.js"

var myArgs = process.argv.slice(2);
var month =  myArgs[0];
console.log("loading " + config.pas.diaryFolder + month);
month2repo(month);
