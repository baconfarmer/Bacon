var bacon = bacon || {};

//main

//constructor
//get config
//setup the storage services
//get event

//event catchers to events

//mixpanel

//local-in memory

bacon.Writer= function(options, callback) {
    callback = typeof callback !== 'undefined' ? callback : function(){};
    options = options || {};
    this.started = this.started || false;
    this.init(options);
    callback();
};

bacon.Writer.prototype = (function() {

    function mixpanelSetup(options){
         console.log('starting log');
        (function(c,a){window.mixpanel=a;var b,d,h,e;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"===c.location.protocol?"https:":"http:")+'//api.mixpanel.com/site_media/js/api/mixpanel.2.js';d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==
        typeof f?g=a[f]=[]:f="mixpanel";g.people=g.people||[];h="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config people.set people.increment".split(" ");for(e=0;e<h.length;e++)d(g,h[e]);a._i.push([b,c,f])};a.__SV=1.1})(document,window.mixpanel||[]);
        mixpanel.init("1f595d6df60bffaae95d4b724a7926c6");
        bacon.vent.off('init:mixpanel');
        return mixpanel;
    }

    return {
        init: function(options){
            if(this.started === false){
                this.vent = options.vent || bacon.vent;
                this.vent.on('init:mixpanel', this.mixpanelInit, this);
                this.started = true;
            }
        },
        mixpanelInit: function(options){
            var self = this;
            this.mixpanel = mixpanelSetup(options);
            this.mixpanel.track('ready')
            console.log(self);
        }
    }
})()