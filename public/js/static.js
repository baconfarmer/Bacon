cyclone_dt = new Date();
var guid = 0;

jQuery(document).ready(function() {
    track_init();
});

function track_init() {
    env = {};
    env.u = document.location.href;
    env.bw = window.innerWidth;
    env.bh = window.innerHeight;
    env.title = document.title;
    guid = guidGenerator();
    env.uid = guid;
    if (document.referrer && document.referrer !== "") {
        env.ref = document.referrer;
    }
//    if (cyclone_dt) {
//        env.action = 'page_load';
//        env.action_misc = '';
//        env.timing = new Date() - cyclone_dt;
//    }
    jQuery('body').append('<img style="display:none;" src="http://97.107.198.131:3000/?' + jQuery.param(env) + '"/>');
    track('page_load',  new Date() - cyclone_dt);
    jQuery.getScript('http://97.107.198.131:8000/beacon');
    return guid;
}

function track(action, misc) {
    env = {};
    if (!misc) {
        misc = ''
    }
    if (guid !== 0) {
        env.uid = guid;
    }
    else {
        env.uid = track_init();
    }
    env.action = action;
    env.action_misc = misc;
    env.action = 1;
    if (cyclone_dt) {
        env.timing = new Date() - cyclone_dt;
    }
    jQuery('body').append('<img style="display:none;" src="http://97.107.198.131:3000/?' + jQuery.param(env) + '"/>');
}

function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}