var Cyclone = Cyclone || {};

jQuery(document).ready(function() {
    var cyclone_main = new Cyclone.main()

});

Cyclone.main = function(env, callback) {
    this.t0 = new Date();
    this.env = env || {};
    callback = callback || {};
    this.guid = this.checkSession(this.env);
    this.init(callback);
};

Cyclone.main.prototype = {
    init: function(callback) {
        this.env.h= document.location.hostname.toString();
//    path = document.location.href.replace('http://'+document.location.hostname,'').replace('?','');
        this.env.p = document.location.pathname.toString() || '/';
        this.env.a =getUrlVars()["_act"];
        this.env.t = document.title;
        if (document.referrer && document.referrer !== "") {
            this.env.r = document.referrer;
        }
//        if ( jQuery.browser.msie ) {
//            if (parseInt(jQuery.browser.version)>=9){
//                this.env.w= window.innerWidth.toString();
//                this.env.h=window.innerHeight.toString();
//            }
//        } else {
//            this.env.w= window.innerWidth.toString();
//            this.env.h=window.innerHeight.toString();
//        }
        jQuery('body').append('<img style="display:none;" src="http://cyclone.inflection.com:3000/?' + jQuery.param(this.env) + '"/>');
        this.track('page_load',  new Date() - this.t0);
        //jQuery.getScript('http://cyclone.inflection.com:8000/url'+path);
//        return guid;
        return callback;
    },
    track: function(action) {
    var event = {};
    action = action || {};
    if (this.guid !== 0) {
        event.v = this.guid;
    }
    else {
        event.v = track_init();
    }
    event.n = action;
    if (cyclone_dt) {
        event.t = new Date() - cyclone_dt;
    }
//    event.action=true;
    jQuery('body').append('<img style="display:none;" src="http://cyclone.inflection.com:3000/?' + jQuery.param(event) + '"/>');

    },
    guid: function() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
    return (S4() + S4() + S4()  + S4()  + S4() + S4() + S4() + S4())
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
        if (get_cookie("Cyclone_SessionTS")!=""){
            env.s=this.get_cookie("Cyclone_SessionTS")+uuid.substring(0,11);
        }
        //plant cookie if none exists
        else{
            document.cookie='Cyclone_SessionTS='+uuid.substring(0,20);
            if (get_cookie("Cyclone_SessionTS")!=""){
                env.s=uuid;
            }
        }
        if (this.get_cookie('Cyclone_CustomerID')!=""){
            env.c=this.get_cookie("Cyclone_CustomerID");
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
