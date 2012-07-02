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
    'urls':{
    //    'resultsids/psp.aspx':'psp.aspx_act=resultsids.js',
        'no_act/identity/profile.html':'profile.js'
        ,'resultswp/psp.aspx':'psp.aspx_act=resultswp.js'},
    'search_metrics':{'firstname':'f'
        ,'lastname':'l'
        ,'middlename':'m'
        ,'maidenname':'o'
        ,'state':'s'
        ,'zip':'z'
        ,'city':'p'//place
        ,'session':'z'//session id
        ,'visit':'v'
        ,'_id':'_id'
        ,'count':'c'
        ,'duration':'d' //duration
        ,'target':'t' //
        ,'pick':'i'//pick
        ,'funnel':'g' //search group
    },
    'visit_metrics':[
        'h',//domain
        'p',//path
        'r',//referrer
        '_id',//pk
        'a',//action
        't',//title
        'c', //customer id
        'v', //visit id
        't',//split test
        's' //session id
            ]
    ,
    'action_metrics':[
        'p', //page id
        'n',//event name
        's',//session id
        't',//time relative
        'v' //Values
        ]
    ,
//    "udp_address" : "127.0.0.1",
//    "udp_port" : 8000,

    "debug":0
}
