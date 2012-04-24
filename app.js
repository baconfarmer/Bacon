var express = require('express'),
    Db = require('./track/db').Db,
    Track = require('./track/track').Track,
    Dashboard = require('./dashboard/dashboard').Dashboard,
    Beacon = require('./beacon/beacon').Beacon,
    config = require('./config/config');

var tracker = 0;
var dashboard = 0;

//setup databases
var db = new Db(function(){
    //setup interal tracker
    if(tracker === 0){
        tracker = new Track(express.createServer(),db);
    }
    //setup dashboard server
    if(dashboard === 0){
        dashboard = new Dashboard(express.createServer(),db);
    }
});

//setup beacon server
var beacon = new Beacon(express.createServer());
