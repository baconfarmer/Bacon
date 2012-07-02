var Cyclone = Cyclone || {};

Cyclone.main = function(env, callback) {
    this.t0 = new Date();
    this.env = env || {};
    this._id =this.env._id = this.guid();
//    env._id;
    callback = callback || {};
    this.guid = this.checkSession(this.env);
    this.init(callback);
};

Cyclone.main.prototype = {
    init: function(callback) {
        this.env.h= document.location.hostname.toString();
//    path = document.location.href.replace('http://'+document.location.hostname,'').replace('?','');
        this.env.p = document.location.pathname.toString() || '/';
        this.env.a = this.getUrlVars()["_act"] || '';
        this.env.t = document.title;
        if (document.referrer && document.referrer !== "") {
            this.env.r = document.referrer;
        }
        //TODO
        //this.env.v = storm.visitId
        //this.env.t = storm.split_test
        //this.env.c = storm.customer_id
//        if ( jQuery.browser.msie ) {
//            if (parseInt(jQuery.browser.version)>=9){
//                this.env.w= window.innerWidth.toString();
//                this.env.h=window.innerHeight.toString();
//            }
//        } else {
//            this.env.w= window.innerWidth.toString();
//            this.env.h=window.innerHeight.toString();
//        }
        jQuery('body').append('<img style="display:none;" src="https://cyclone.inflection.com:3000/?' + jQuery.param(this.env) + '"/>');
//        var action={};
//        action.name='test';
//        action.values={};
//        action.values.a='aa';
//        action.values.b='bb';
//
//        this.track(action);
        //console.log(this.env.p.replace(/\/./g, ''));
        if(typeof this.env.a !== 'undefined'){
            jQuery.getScript('https://cyclone.inflection.com:8000/url/'+this.env.a+this.env.p);
        }
        else{
            jQuery.getScript('https://cyclone.inflection.com:8000/url/no_act'+this.env.p);
        }

//        return guid;
        return callback;
    },
    track: function(action) {
        var event = {};
        action = action ||{};
        event.s = this.guid || this.checkSession(this.env);
        event.p = this._id || function(){this._id=this.guid();return (this._id)};
        event.n = action.name || 'no name';
        event.v = JSON.stringify(action.values) || {};
        if (typeof this.t0 !== 'undefined') {
            event.t = new Date() - this.t0;
        }
        event.action=true;
        jQuery('body').append('<img style="display:none;" src="https://cyclone.inflection.com:3000/?' + jQuery.param(event) + '"/>');
    },
    guid: function() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    // Read a page's GET URL variables and return them as an associative array.
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    checkSession: function(env){
        //check for session cookie
        var uuid = this.guid();
        if (this.get_cookie("Cyclone_SessionTS")!=""){
            env.s=this.get_cookie("Cyclone_SessionTS");
        }
        //plant cookie if none exists
        else{
            document.cookie='Cyclone_SessionTS='+uuid;
            if (this.get_cookie("Cyclone_SessionTS")!==""){
                env.s=uuid;
            }
        }
        return env.s;
    },
    //Get cookie routine by Shelley Powers
    get_cookie: function(Name){
        var search = Name + "=";
        var returnvalue = "";
        var offset, end;
        if (document.cookie.length > 0) {
            offset = document.cookie.indexOf(search)
            // if cookie exists
            if (offset != -1) {
                offset += search.length
                // set index of beginning of value
                end = document.cookie.indexOf(";", offset);
                // set index of end of cookie value
                if (end == -1) end = document.cookie.length;
                returnvalue=unescape(document.cookie.substring(offset, end))
            }
        }
        return returnvalue;
    }
}
var cyclone={};
jQuery(document).ready(function() {
    cyclone.main = new Cyclone.main();
});

//(function () {
//
//    function loadScript(url, callback) {
//
//        var script = document.createElement("script")
//        script.type = "text/javascript";
//
//        if (script.readyState) { //IE
//            script.onreadystatechange = function () {
//                if (script.readyState == "loaded" || script.readyState == "complete") {
//                    script.onreadystatechange = null;
//                    callback();
//                }
//            };
//        } else { //Others
//            script.onload = function () {
//                callback();
//            };
//        }
//
//        script.src = url;
//        document.getElementsByTagName("head")[0].appendChild(script);
//    }
//
//    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js", function () {
//
//        //jQuery loaded
//        console.log('jquery loaded');
//
//    });
//
//})();