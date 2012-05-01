cyclone_dt = new Date();
var guid = 0;

jQuery(document).ready(function() {
    track_init();
});

function track_init() {
    var env = {};
    guid = checkSession(env);
    env.h = document.location.host.toString();
    path = document.location.pathname.toString();
    path = typeof path !== 'undefined' ? path : '/';
    env.p = path;
    env.width= window.innerWidth.toString();
    env.height=window.innerHeight.toString();
    env.t = document.title;
    if (document.referrer && document.referrer !== "") {
        env.r = document.referrer;
    }
    jQuery('body').append('<img style="display:none;" src="http://cyclone.inflection.com:3000/?' + jQuery.param(env) + '"/>');
    track('page_load',  new Date() - cyclone_dt);
    jQuery.getScript('http://cyclone.inflection.com:8000/url'+path);
    return guid;
}

function track(action, misc) {
    var env = {};
    misc = typeof misc !== 'undefined' ? env.p=misc : 0;
    if (guid !== 0) {
        env.v = guid;
    }
    else {
        env.v = track_init();
    }
    env.n = action;
    if (cyclone_dt) {
        env.t = new Date() - cyclone_dt;
    }
    env.action=true;
    jQuery('body').append('<img style="display:none;" src="http://cyclone.inflection.com:3000/?' + jQuery.param(env) + '"/>');
}

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4()  + S4()  + S4() + S4() + S4() + S4());
}

function checkSession(env){
    //check for session cookie
    var uuid = guidGenerator();
    if (get_cookie("Cyclone_SessionTS")!=""){
        env._id=get_cookie("Cyclone_SessionTS")+uuid.substring(0,11);
    }
    //plant cookie if none exists
    else{

        document.cookie='Cyclone_SessionTS='+uuid.substring(0,20);
        if (get_cookie("Cyclone_SessionTS")!=""){
            env._id=uuid;
        }
    }
    if (get_cookie('Cyclone_CustomerID')!=""){
        env.c=get_cookie("Cyclone_CustomerID");
    }
    return env._id;
}

//Get cookie routine by Shelley Powers
function get_cookie(Name) {
    var search = Name + "=";
    var returnvalue = "";
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