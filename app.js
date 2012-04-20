var express = require('express'),
    Db = require('./track/db').Db,
    Track = require('./track/track').Track,
    Dashboard = require('./dashboard/dashboard').Dashboard,
    Beacon = require('./beacon/beacon').Beacon,
    config = require('./config/config');

//setup databases
var db = new Db(function(){
    startServer(db);
    startDashboard(db);
});

app_started = false;
dashboard_started = false;

//setup beacon
var beacon_app = express.createServer();
beacon_app.configure(function(){
    //setup middleware
    beacon_app.use(express.logger());
    beacon_app.use(express.bodyParser());
    beacon_app.use(beacon_app.router);
    //setup public static dir
    beacon_app.use(express.static(__dirname + '/public'));
    if(config.debug){
        console.log('in dev')
        beacon_app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }
    else{
        beacon_app.use(express.errorHandler());
    }
});

beacon_app.get('/beacon', function(req, res){
    // return beacon
    res.redirect('/js/template.js');
});

beacon_app.on('error', function() {
    console.log("error");
});

beacon_app.get('/', function(req, res){
    // return static file
    res.redirect('/js/static.js');
});

console.log("Opening Beacon Port");
beacon_app.listen(config.beacon_port, function() {
    address = beacon_app.address();
    console.log("opened beacon server on %j", address);    
});


function startServer(database){    
    //create Tracking Server
    if(app_started==false){
        app = express.createServer();
        console.log("Opening Tracker Port");
        app.listen(config.tracking_port, function() {
            address = app.address();
            console.log("opened tracking server on %j", address);
            app_started = true;
        });
    
        var track = new Track();
        track.init(database, function() {
            app.get('/', function(req, res){
                track.serveRequest(req, res);
            });
        });
    }
}

function startDashboard(database){
    //create Tracking Server
    if(dashboard_started==false){
        dashboard_app = express.createServer();
        dashboard_app.configure(function(){
            //setup middleware
            dashboard_app.use(express.logger());
            dashboard_app.use(express.bodyParser());
            dashboard_app.use(dashboard_app.router);
            if(config.debug){
                console.log('dashboard in dev');
                dashboard_app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
            }
            else{
                console.log('dashboard in prod');
                dashboard_app.use(express.errorHandler());
            }
        });
        console.log("Opening Dashboard Port");
        dashboard_app.listen(config.dashboard_port, function() {
            address = dashboard_app.address();
            console.log("opened dashboard server on %j", address);
            dashboard_started = true;
        });

        var dashboard = new Dashboard();
        dashboard.init(database, function() {
            dashboard_app.get('/metrics/:name/:time?', function(req, res){

                //name of metric
                var name = req.params.name;
                var time = req.params.time;
                if (!config.metrics.indexOf(name)) {
                    if (!time){
                        time=60;
                    }
                    dashboard.getMetric(name,time,function(value){
                        res.json(value);
                    });
                } else {
                    next();
                }
            });
        });

    }
}