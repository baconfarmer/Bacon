module.exports = config = {
    "name" : "Cyclone",

    "tracking_port" : 3000,//3000,
    "beacon_port" : 80,
    "dashboard_port" :8000,// 8888,
    
    "redis_host" :"10.3.0.41", //"omadc-cyclone-redis1.psm.local",//
    "redis_port" : 6379,

    "mongo_host" : "10.3.0.42",//"omadc-cyclone-mongo1.psm.local",//
    "mongo_db_name" : "cyclone",
    "mongo_port" : 27017,

    'metrics':['pageview'],

    "udp_address" : "127.0.0.1",
    "udp_port" : 8000,

    "debug":0
}