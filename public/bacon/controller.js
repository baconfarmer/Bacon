var bacon = bacon || {};

require(["lib/jquery-1.7.1.min","lib/underscore",'lib/backbone-min','writer','parser'], function($) {
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
        if(_.has(data,'action')){
            if(_.has(data.action,'id')){
                return data.action.id;
            }
        }
        return false;
    },
    setEvent: function(){
        bacon.vent = _.extend({}, Backbone.Events);
        this.vent = bacon.vent;
        return this.vent
    },
    initParser: function(){
        _.each(this.config.parser, this.triggerInit);
    },
    initWriter: function(){
        _.each(this.config.writer, this.triggerInit);
    },
    triggerInit: function(value,key,list){
        value.options = value.options || {};
        bacon.vent.trigger('init:'+value.name,value.options)
    }
}