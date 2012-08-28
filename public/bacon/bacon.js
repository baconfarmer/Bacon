var bacon = bacon || {};
(function () {
//    bacon.configPath="/js/bacon/actions/";
    bacon.configPath="http://psp-beta.intranet.peoplesearchmedia.com/waf/js/bacon/id/actions/";

    bacon.Primer= function(options, callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};
        this.init(options);
        callback();
    };
    bacon.Primer.prototype={
        init: function(options){
            var self = this;
            if(typeof (jQuery)==='undefined'){
                this.loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js", function () {
                    jQuery(document).ready(function(){
//                        self.checkStatus("http://psp-beta.intranet.peoplesearchmedia.com/waf/js/bacon/id/actions/"+'ps'+'.js',self.initBacon);
                        self.checkStatus(bacon.configPath+window.location.hostname+'.js',self.initBacon);
                    });
                });
            }
            else{
                jQuery(document).ready(function(){
                    self.checkStatus(bacon.configPath+window.location.hostname+'.js',self.initBacon);
//                    self.checkStatus("http://psp-beta.intranet.peoplesearchmedia.com/waf/js/bacon/id/actions/"+'ps'+'.js',self.initBacon);
                });
            }
        },
        initBacon: function(config_success){
          if(config_success){
              var options ={page_data:storm};
              bacon.c = new bacon.Controller(options,function(){});
          }
        },
        loadScript: function(url, callback) {
            var script = document.createElement("script")
            script.type = "text/javascript";
            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else { //Others
                script.onload = function () {
                    callback();
                };
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        checkStatus: function (address, callback) {
            if(typeof (address)!=='undefined'){
                jQuery.ajax({
                    url: address,
                    crossDomain:true,
                    dataType:'jsonp',
                    success: function(){
                        callback(true);
                    },
                    error: function(){
                        callback(false);
                    }
                });
            }
        }
//        ,
//        getAction: function (){
//            var data = storm;
//            if(typeof data.action !== 'undefined'){
//                if(typeof data.action.id !== 'undefined'){
//                    return data.action.id;
//                }
//            }
//            return false;
//        }
    }

    bacon.Controller= function(options, callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};
        this.init(options);
        callback();
    };
    bacon.Controller.prototype={
        init:function(options){
            this.page_data = options.page_data||{};
            this.setEvent();
            bacon.w = new bacon.Writer({},function(){
                bacon.p = new bacon.Parser();
            });
            this.config = bacon.config[this.getAction()];
            this.initParser();
            this.initWriter();
        },
        setEvent: function(){
//            bacon.trackEvent = function(category) {
////                console.log(category);
//            }
            bacon.vent = jQuery('<div id="#baconEvents"></div>').appendTo('body');
            this.vent = bacon.vent;
            return this.vent
        },
        initParser: function(){
            var self = this;
            this.config = this.config || {};
            this.config.parser = this.config.parser || [];
            this.config.parser.forEach(function(object){
                self.triggerInit(object);
            });
        },
        initWriter: function(){
            var self = this;
            this.config = this.config || {};
            this.config.writer = this.config.writer || [];
            this.config.writer.forEach(function(object){
                self.triggerInit(object);
            });
        },
        triggerInit: function(value,key,list){
//            console.log(value.name);
            value.options = value.options || {};
            this.vent.trigger('init-'+value.name,value.options);
        },
        getAction: function (){
            var data = storm;
            if(typeof data.action !== 'undefined'){
                if(typeof data.action.id !== 'undefined'){
                    return data.action.id;
                }
            }
            return window.location.pathname;
        }
    }

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
            options.data = jQuery(obj).data();
            return options;
        }
        return {
            init: function(options){
                options = options || {};
                if(this.started===false){
                    this.vent = options.vent || bacon.vent;
                    this.vent.bind('init-data_dash', this.dataDash);
                    this.vent.bind('init-page_load', this.pageLoad);
                    this.started = true;
                }
            },
            dataDash: function(options){
                var self = this;
                jQuery("body").bind("click", "[data-cyclone-id]", function(e) {
                    var cyclone = jQuery(e.target).data("cyclone-id");
                    var data;
                    if (typeof cyclone === "undefined") {
                        var value;
                        value = jQuery(e.target).parents("[data-cyclone-id]");
                        data = parseDataObject(value[0]);
                    }
                    else{
                         data=parseDataObject(e.target);
                    }
                    data.name = 'click';
                    bacon.vent.trigger('write-event', data);
                    jQuery(e.target).css('border','1px solid red')
                });
                bacon.vent.unbind('init-data_dash');
            },
            pageLoad: function(options){
                var self = this;
                var event = {};
                event.name = 'pageload';
                event.data = {};
                event.data.url= window.location.pathname;
                bacon.vent.trigger('write-event', event);
                bacon.vent.unbind('init-page_load');
            }
        }
    })();

    bacon.Writer= function(options, callback) {
        callback = typeof callback !== 'undefined' ? callback : function(){};
        options = options || {};
        this.started = this.started || false;
        this.init(options, callback);

    };
    bacon.Writer.prototype = {
        init: function(options, callback){
                if(this.started === false){
                    this.vent = options.vent || bacon.vent;
//                    this.vent.on('init-mixpanel', this.mixpanelInit);
                    this.vent.bind('init-GA', this.GAInit);
                    console.log(options);
                    //mixpanel
                    (function(c,a){window.mixpanel=a;var b,d,h,e;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"===c.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.0.min.js';d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==typeof f?
                        g=a[f]=[]:f="mixpanel";g.people=g.people||[];h="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config people.set people.increment".split(" ");for(e=0;e<h.length;e++)d(g,h[e]);a._i.push([b,c,f])};a.__SV=1.1})(document,window.mixpanel||[]);
                    mixpanel.init("3c5c277b364eaa532ae4ebc9e50d742d");
                    this.vent.bind('write-event', function(obj, data){
                        mixpanel.track(data.name, data.data);
                    });

                    this.started = true;
                    callback();
                }
        },
        GAInit: function(options){
            console.log(options);
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-34368989-1']);
            _gaq.push(['_trackPageview']);
            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
        }
// ,
//        mixpanelInit: function(options){
////            (function(c,a){window.mixpanel=a;var b,d,h,e;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"===c.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.0.min.js';d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==typeof f?
////                g=a[f]=[]:f="mixpanel";g.people=g.people||[];h="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config people.set people.increment".split(" ");for(e=0;e<h.length;e++)d(g,h[e]);a._i.push([b,c,f])};a.__SV=1.1})(document,window.mixpanel||[]);
////            mixpanel.init("3c5c277b364eaa532ae4ebc9e50d742d");
//            bacon.vent.off('init-mixpanel');
////            bacon.vent.on('write:event', this.eventWriter);
//            bacon.vent.on('write-event', function(){
//                alert('yay2');
//            });
//            this.mixpanel=mixpanel;
//            console.log(this.mixpanel)
//            return mixpanel;
//         }
    };
    bacon.starter = new bacon.Primer();
})();

