var bacon = bacon || {};

require(["lib/jquery-1.7.1.min",'writer','parser'], function($) {
    var options ={page_data:storm};
    bacon.c = new bacon.Controller(options,function(){
        bacon.p = new bacon.Parser();
        bacon.w = new bacon.Writer();
    } );
});

bacon.Controller= function(options, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};
    this.init(options);
    callback();
};

bacon.Controller.prototype={
    init:function(options){
        this.page_data = options.page_data||{};
        var action = this.getAction(this.page_data);
        if(action){
            this.setEvent();
            var action_url='actions/'+action;
            this.main(action_url);
        }
    },
    main: function(url){
        var self = this;
        require([url], function() {
            self.config = bacon.config;
            self.initParser();
            self.initWriter();
        });
    },
    getAction:function(data){
        if(typeof data.action !== 'undefined'){
            if(typeof data.action.id !== 'undefined'){
                return data.action.id;
            }
        }
        return false;
    },
    setEvent: function(){
        bacon.trackEvent = function(category) {
            console.log(category);
        }
        bacon.vent = $('<div id="#baconEvents"></div>').appendTo('body');
//        $('body').append();
//        bacon.vent = $('#baconEvents');
//        bacon.vent = _.extend({}, Backbone.Events);
        this.vent = bacon.vent;
        return this.vent
    },
    initParser: function(){
        var self = this;
        this.config.paraser = this.config.parser || [];
        this.config.parser.forEach(function(object){
            self.triggerInit(object);
        });
    },
    initWriter: function(){
        var self = this;
        this.config.writer = this.config.writer || [];
        this.config.writer.forEach(function(object){
            self.triggerInit(object);
        });
    },
    triggerInit: function(value,key,list){
        value.options = value.options || {};
        console.log(value.name);
        this.vent.trigger('init-'+value.name,value.options);
    }
}