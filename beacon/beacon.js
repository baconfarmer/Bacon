var config = require('../config/config'),
    path = require("path"),
    express = require('express');

var Beacon = function(beacon_app, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};
    this.app = beacon_app;
    this.init();
    callback();
};

Beacon.prototype = {
    init: function(callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};
        var self = this;
        //setup beacon
        self.app.configure(function(){
            //setup middleware
            self.app.use(express.logger());
            self.app.use(express.bodyParser());
            self.app.use(self.app.router);
            //setup public static dir
            self.app.use(express.static(path.join(__dirname, '..', 'public/')));
            if(config.debug){
                console.log('in dev')
                self.app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
            }
            else{
                self.app.use(express.errorHandler());
            }
        });

        self.app.get('/beacon', function(req, res){
            // return beacon
            res.redirect('/js/template.js');
        });

        self.app.on('error', function() {
            console.log("error");
        });

        for (url in config.urls){
            if(config.debug){
                console.log(url +' maps to ' + config.urls[url])
            }
            self.app.get('/url/'+url, function(req, res){
                // return static file
                res.redirect('/js/page_tracking/'+config.urls[url]);
            });
        }

        self.app.get('/', function(req, res){
            // return static file
            res.redirect('/js/static.js');
        });

        console.log("Opening Beacon Port");
        self.app.listen(config.beacon_port, function() {

            address = self.app.address();
            console.log("opened beacon server on %j", address);
        });
        callback();
    }
}

exports.Beacon = Beacon;
