var config = require('../config/config'),
    path = require("path"),
    fs = require('fs');
var db_connection;

var Track = function(db, callback) {
    var pixelData = fs.readFileSync(path.join(__dirname, '..', 'public/images/')+'tracking.gif', 'binary');
    this.pixel = new Buffer(43);
    this.pixel.write(pixelData, 'binary', 0);
//    this.metrics = [];
};

Track.prototype = {
    init: function(db, callback) {
        db_connection=db;
        callback();
    },
    serveRequest: function(req, res) {
        this.writePixel(res);
        //logging
        var env = this.splitQuery(req.url.split('?')[1]);
        //metrics tracking
        //set timestamp
        if(!env.timestamp){
            env.timestamp = new Date();
        }
        //for each in config.metrics[] call incCounter() with the metrics name
        var name;
        for (name in env){
//            if(config.debug){
//                console.log("metrics tracking " + name);
//            }
            if (!config.metrics.indexOf(name)){
                db_connection.incrCounter(name,env.timestamp,env[name]);
            }
        }

        //log raw data
        //get ip address
        env.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //get header
        if(!env.action){
            env.user_agent = req.headers['user-agent'];
            if(req.headers['referer']&&req.headers['referer']!=''){
                env.refer = req.headers['referer'];
            }
        }
        //insert into db
        db_connection.insRaw(env);
    },
    splitQuery: function(query) {
        var queryString = {};
        (query || "").replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function($0, $1, $2, $3) { queryString[$1] = unescape($3.replace(/\+/g, ' ')); }
        );
        return queryString;
    },
    writePixel: function(res) {
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Disposition': 'inline',
            'Content-Length': '43' });
        res.end(this.pixel);
    }
}

exports.Track = Track;
