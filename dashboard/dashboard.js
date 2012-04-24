var config = require('../config/config.js'),
    express = require('express');

var Dashboard = function(dashboard_app, db, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};
    this.db_connection=db;
    this.app=dashboard_app;
    this.init();
    callback();
};

Dashboard.prototype = {
    init: function(callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};
        var self=this;
        self.app.configure(function(){
            //setup middleware
            self.app.use(express.logger());
            self.app.use(express.bodyParser());
            self.app.use(self.app.router);
            if(config.debug){
                console.log('Dashboard in dev');
                self.app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
            }
            else{
                console.log('Dashboard in prod');
                self.app.use(express.errorHandler());
            }
        });
        self.app.listen(config.dashboard_port, function() {
            address = self.app.address();
            console.log("opened dashboard server on %j", address);
            dashboard_started = true;
        });

        self.app.get('/metrics/:name/:time?', function(req, res){
            //name of metric
            var name = req.params.name;
            var time = req.params.time;
            if (!config.metrics.indexOf(name)) {
                if (!time){
                    time=60;
                }
                self.getMetric(name,time,function(value){
                    res.json(value);
                });
            } else {
                next();
            }
        });
        callback();
    },
    getMetric: function(name,time,callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};
        var self = this;
        this.db_connection.getMetric(name,time,function(keys, value) {
            var settings ={};
            var ymax=Math.max(Math.max.apply( Math, value ),5);
            var ymin=Math.min.apply( Math, value );
            var xmax=Math.max.apply( Math, keys );
            var xmin=Math.min.apply( Math, keys );
            settings["axisx"]=[self.toDateTime(xmin),self.toDateTime(xmin+(xmax-xmin)/2),self.toDateTime(xmax)];
            settings["axisy"]=[ymin,ymin+(ymax-ymin)/2,ymax];
            settings["colour"]="ff9900"
            value={"item":value,"settings":settings};
            callback(value);
        });
    },
    toDateTime: function(secs){
        var t = new Date(1970,0,1);
        t.setSeconds(secs);
        return t.getHours()+":"+t.getMinutes()+':'+t.getSeconds();
    }
}

exports.Dashboard = Dashboard;
