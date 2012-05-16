var config = require('../config/config'),
    path = require("path"),
    fs = require('fs')
    ,io = require('socket.io');

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
        var self=this;
        this.io=io.listen(this.app);
        this.app.listen(config.tracking_port, function() {
            address = self.app.address();
            console.log("opened tracking server on %j", address);
        });
        this.app.get('/', function(req, res){
             self.serveRequest(req, res);
        });
        this.io.sockets.on('connection', function (socket) {
//            socket.emit('news', { hello: 'world' });
            socket.on('search_track', function (data) {
                var collection='search';
                var output={};
                for (name in data){
                    if ( typeof config.search_metrics[name] !== 'undefined'){
                       output[config.search_metrics[name]] =data[name];
                        if(config.debug){
                            console.log(config.search_metrics[name] +': '+ data[name]);
                        }
                    }
                }
                self.db_connection.insRaw(output, collection);
            });
            socket.on('search_track_end', function (data) {
                var collection='id_set';
                var output={};
                output.set={};
                output.id=data.id;
                for (name in data){
                    if ( typeof config.search_metrics[name] !== 'undefined' && name !=='id'){
                        output.set[config.search_metrics[name]] =data[name];
                        if(config.debug){
                            console.log(config.search_metrics[name] +': '+ data[name]);
                        }
                    }
                }
                //console.log("id_set: "+output._id);
                self.db_connection.insRaw(output, collection);
            });
            socket.on('search_track_filter', function (data) {
                var collection='id_push';
                var output={};
                output.set={};
                output.id=data.id;
                for (name in data){
                    if ( typeof config.search_metrics[name] !== 'undefined' && name !=='id'){
                        output.set[config.search_metrics[name]] =data[name];
                        if(config.debug){
                            console.log(config.search_metrics[name] +': '+ data[name]);
                        }
                    }
                }
                //console.log("id_set: "+output._id);
                self.db_connection.insRaw(output, collection);
            });
        });
        callback();
    },
    serveRequest: function(req, res) {
        this.writePixel(res);
        //logging
        var env = this.splitQuery(req.url.split('?')[1]);
        var final_env={};
        //metrics tracking
        //set timestamp
        if(!env.d){
            env.d = new Date();
        }
        final_env.d=env.d;
        //for each in config.metrics[] call incCounter() with the metrics name
        var name;
        for (name in env){
            if (!config.metrics.indexOf(name)){
                this.db_connection.incrCounter(name,env.d,env[name]);
            }
        }
        //log raw data
        var collection = 'visit';

        //get header
        if(!env.action){
            final_env.b = req.headers['user-agent'];
            //get ip address
            final_env.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            if(final_env.b.length>50){
                final_env.b = final_env.b.substring(0,50);
            }
            else{
                final_env=env;
            }
            if(req.headers['referer']&&req.headers['referer']!=''){
                final_env.r = req.headers['referer'];
            }
            final_env.s=[env.width, env.height];
            for (name in env){
                if (config.visit_metrics.indexOf(name)!==-1){
                    final_env[name] =env[name];
                }
            }
        }
        else{
            collection='action';
            for (name in env){
                if (config.action_metrics.indexOf(name)!==-1){
                    final_env[name] = env[name];
                }
            }
        }
        //insert into db
        this.db_connection.insRaw(final_env, collection);
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
