module.exports = config = {
    "name" : "Cyclone",

    "tracking_port" : 3000,//3000,
    "beacon_port" : 8000,
    "dashboard_port" :8080,// 8888,
    
    "redis_host" :"10.3.0.41", //"omadc-cyclone-redis1.psm.local",//
    "redis_port" : 6379,

    "mongo_host" : "10.3.0.42",//"omadc-cyclone-mongo1.psm.local",//
    "mongo_db_name" : "cyclone",
    "mongo_port" : 27017,

    'metrics':['pageview'],
    'urls':{'psp.aspx_act=resultsids':'psp.aspx_act=resultsids.js'},
    'search_metrics':{'firstname':'f'
        ,'lastname':'l'
        ,'middlename':'m'
        ,'maidenname':'o'
        ,'state':'s'
        ,'zip':'z'
        ,'city':'p'//place
        ,'id':'id'
        ,'count':'c'
        ,'duration':'d' //duration
        ,'target':'t' //
        ,'pick':'i'//pick
    },
    'visit_metrics':[
        'h',
        'p',
        't',
        '_id',
        'c']
    ,
    'action_metrics':[
        'p',
        'n',
        'v',
        't',
        'c']
    ,
//    "udp_address" : "127.0.0.1",
//    "udp_port" : 8000,

    "debug":0
}
