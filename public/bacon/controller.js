var bacon = bacon || {};

require(["lib/jquery-1.7.1.min","lib/underscore",'lib/backbone-min','writer','parser'], function($) {
    var options ={page_data:storm}
    bacon.c = new bacon.Controller(options);
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
        require([url], function() {
            console.log(bacon.config);

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
    setEvent:function(){
        bacon.vent = _.extend({}, Backbone.Events);
        this.vent = bacon.vent;
        return this.vent
    },
    initParser:function(){

    },
    initWriter:function(){

    }
}