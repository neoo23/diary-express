const config = {

    "server" : {
        // webserver port
        "port" : 3000,
    },

    "pas" : {
        // year to start/end with building repo
        "repoStartYear" : 2021,
        "repoEndYear"   : 2021,
        // path to diary xml files ...
        "diaryFolder" : "./data/diary/"
    },

    "images" : {
        "imageFolder" : "./data/images/",
        "imageCacheFolder" : "./data/images/_cache"
    }

}

// random element of array!
Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

export default config;