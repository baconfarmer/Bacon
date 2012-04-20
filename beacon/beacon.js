var config = require('../config/config');
//    ,path = require("path"),
//    fs = require('fs');
//var db_connection;

var Beacon = function(db, callback) {
};

Beacon.prototype = {
    init: function(db, callback) {
//        db_connection=db;
        callback();
    }
}

exports.Beacon = Beacon;
