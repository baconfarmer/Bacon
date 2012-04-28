var config = require('../config/config'),
    path = require("path"),
    fs = require('fs');

var Track = function(tracker_app, db, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};
    this.app=tracker_app;
    this.db_connection=db;
    var pixelData = fs.readFileSync(path.join(__dirname, '..', 'public/images/')+'tracking.gif', 'binary');
    this.pixel = new Buffer(43);
    this.pixel.write(pixelData, 'binary', 0);
    this.init();
    callback();
};

Track.prototype = {
    init: function(callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};
        self=this;
        this.app.listen(config.tracking_port, function() {
            address = self.app.address();
            console.log("opened tracking server on %j", address);
        });
        this.app.get('/', function(req, res){
             self.serveRequest(req, res);
        });
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
            if (!config.metrics.indexOf(name)){
                this.db_connection.incrCounter(name,env.timestamp,env[name]);
            }
        }
        //log raw data
        var collection = 'visit';
        //get ip address
        env.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //get header
        if(!env.action){
            env.user_agent = req.headers['user-agent'];
            if(req.headers['referer']&&req.headers['referer']!=''){
                env.refer = req.headers['referer'];
            }
        }
        else{
            collection='action';
        }
        //insert into db
        this.db_connection.insRaw(env, collection);
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
