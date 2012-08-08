var bacon = bacon || {};

bacon.Parser= function(options, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};
    options=options || {};
    this.started = this.started || false;
    this.init(options);
    callback();
};

bacon.Parser.prototype=(function() {

    var started = false;

    function parseDataObject(obj, options){
        var options = options ||{};
        options.data = $(obj).data();
        return options;
    }

    return {
        init: function(options){
            if(this.started===false){
                this.vent = options.vent || bacon.vent;
                this.vent.on('init:data_dash', this.dataDash, this);
                this.started = true;
            }
        },
        dataDash: function(options){
            var self = this;
            this.tracked=document.querySelectorAll('[data-cyclone-id]');
            if(_.isObject(this.tracked)){
                _.each(this.tracked, function(obj){
                    $(obj).click(function() {
                        self.vent.trigger('event:click', parseDataObject(obj));
                        $(obj).css('border','1px solid red')
                    });
                    var tempTimer;
                    $(obj).hover(
                        function () {
                            tempTimer=new Date();
                        },
                        function () {
                            var hoverTime= new Date()-tempTimer;
                            if(hoverTime>=250){
                                $(obj).css('border','1px solid yellow')
                                self.vent.trigger('event:hover', parseDataObject(obj));
                            }
                        }
                    );
                    $(obj).css('border','1px solid red')
                });
            }
            this.vent.off('init:data_dash');
        }
    }
})()