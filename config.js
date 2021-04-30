const config = {

    "server" : {
        // webserver port
        "port" : 3000,
    },

    "pas" : {
        // year to start/end with building repo
        "repoStartYear" : 2020,
        "repoEndYear"   : 2021,
        // path to diary xml files ...
        "diaryFolder" : "c:/data/life/diary/xml/"
    },

    "images" : {
        "imageFolder" : "c:/data/life/images/",
        "imageCacheFolder" : "c:/data/life/images/_cache"
    }

}

// random element of array!
Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

export default config;