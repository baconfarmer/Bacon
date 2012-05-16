var config = require('../config/config'),
    mongo = require('mongodb'),
    redis = require("redis");

var Db = function(callback) {
    this.init(callback);
};

Db.prototype = {
    init: function(callback) {
        //init redis
        var self = this;
        var redisclient = redis.createClient(config.redis_port, config.redis_host);
        redisclient.on("connect", function () {
            self.redis_db=redisclient;
            //init mongodb
            var mongoclient = new mongo.Db(config.mongo_db_name, new mongo.Server(config.mongo_host, config.mongo_port, {}), {});
            mongoclient.addListener("error", function(err) {
                console.log("Error connecting to mongo -- perhaps it isn't running?");
            });
            mongoclient.open(function() {
                self.mongo_db = mongoclient;
                self.mongo_db.createCollection('actions', function(err, collection) {
                    self.mongo_db.collection('actions', function(err, collection) {
                        self.actions = collection;
                        collection.ensureIndex( { v : 1, n:1, c:1} );
//                        collection.ensureIndex( { q : 1} );
                        self.mongo_db.createCollection('visits', function(err, collection){
                            self.mongo_db.collection('visits', function(err, collection) {
                                collection.ensureIndex( { id:1, d : 1, c:1, p : 1 } );
//                                collection.ensureIndex( { h : 1 } );
                                self.visits = collection;
                                self.mongo_db.createCollection('searches', function(err, collection){
                                    self.mongo_db.collection('searches', function(err, collection) {
                                        collection.ensureIndex( {  id : 1, f: 1, l:1 } );
                                        collection.ensureIndex( {  d : 1, c: 1 } );
////                                collection.ensureIndex( { h : 1 } );
                                        self.searches = collection;
                                        callback();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        redisclient.on("error", function (err) {
            console.log(err);
        });
    },
    insRaw: function(env, collection) {
        switch(collection){
            case "action":
                if(config.debug){
                    console.log("Mongod - actions");
                }
                this.actions.insert([env]);
                break;
            case "visit":
                if(config.debug){
                    console.log("Mongod - visits");
                }
                this.visits.insert([env]);
                break;
            case "search":
                if(config.debug){
                    console.log("Mongod - searches");
                }
                this.searches.insert([env]);
                break;
            case "id_push":
                if(config.debug){
                    console.log("id_push");
                }
                this.searches.update({'id':env.id},{'$push':env.push});
                break;
            case "id_set":
                if(config.debug){
                    console.log("id_set");
                }
//                console.log("id_set: "+env._id);
                this.searches.update({'id':env.id},{'$set': env.set});
                break;
        }
    },
    incrCounter: function(metric_name, time, count, callback){
        callback = typeof callback !== 'undefined' ? callback : function(){};
        count = typeof count !== 'undefined' ? this.checkInt(count) : 1;
        //concatenate time(sec since 1970) to metric_name(str)
        //inc or insert into the db
        this.redis_db.INCRBY(metric_name+'.'+(Math.floor(time.valueOf()/1000)),count);
        if(config.debug){
            console.log("Incr "+ metric_name+'.'+(Math.floor(time.valueOf()/1000))+" by "+count);
        }
        callback();
    },
    checkInt: function(x) {
        var y=parseInt(x);
        if (isNaN(y)){
            return 1;
        }
        else{
            return y;
        }
    },
    getMetric: function(metric_name,time_counter,callback) {
        //variable defined
        callback = typeof callback !== 'undefined' ? callback : function(){};
        time_counter = typeof time_counter !== 'undefined' ? time_counter : 0;
//        var dict = {};
        var self = this;
        var time=new Date();
        var keys=[];
        var times=[];
        var j=0;
        //generate list of keys
        for (i=time_counter;i>0;i--){
            keys[j]=metric_name+'.'+((Math.floor(time.valueOf()/1000))-i);
            times[j]=((Math.floor(time.valueOf()/1000))-i);
            j++;
        }
        //redis lookup
        this.redis_db.MGET(keys, function(err, value) {
            for (x=0;x<value.length;x++){
                if(!value[x]){
                    value[x]=0;
                }
            }
            callback(times,value);
        });
    }
}

exports.Db = Db;
