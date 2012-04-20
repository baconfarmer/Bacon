var config = require('../config/config.js'),
    path = require("path"),
    fs = require('fs');
var db_connection;

var Dashboard = function(db, callback) {
//    this.metrics = [];
};

Dashboard.prototype = {
    init: function(db, callback) {
        db_connection=db;
        callback();
    },
    getMetric: function(name,time,callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};
        var self = this;
        db_connection.getMetric(name,time,function(keys, value) {
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
