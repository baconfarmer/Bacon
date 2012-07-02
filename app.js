var express = require('express'),
    fs = require('fs'),
    Db = require('./track/db').Db,
    Track = require('./track/track').Track,
    Dashboard = require('./dashboard/dashboard').Dashboard,
    Beacon = require('./beacon/beacon').Beacon,
    config = require('./config/config');

var privateKey = fs.readFileSync('privateKey.key').toString();
var certificate = fs.readFileSync('cyclone.inflection.com.crt').toString();

var tracker = 0;
var dashboard = 0;

//setup databases
var db = new Db(function(){
    //setup internal tracker
    if(tracker === 0){
        tracker = new Track(express.createServer({key: privateKey, cert: certificate}),db);
    }
    //setup dashboard server
    if(dashboard === 0){
        dashboard = new Dashboard(express.createServer({key: privateKey, cert: certificate}),db);
    }
});

//setup beacon server
var beacon = new Beacon(express.createServer({key: privateKey, cert: certificate}));
