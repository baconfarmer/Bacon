(function(d,c){var a,b,g,e;a=d.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===d.location.protocol?"https:":"http:")+'//api.mixpanel.com/site_media/js/api/mixpanel.2.js';b=d.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);c._i=[];c.init=function(a,d,f){var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";g="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config".split(" ");
    for(e=0;e<g.length;e++)(function(a){b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,0)))}})(g[e]);c._i.push([a,d,f])};window.mixpanel=c})(document,[]);
mixpanel.init("3c5c277b364eaa532ae4ebc9e50d742d");

var Cyclone = Cyclone ||{};
Cyclone.tracked=document.querySelectorAll('[data-cyclone-id]');
if(_.isObject(Cyclone.tracked)){
    _.each(Cyclone.tracked, function(obj){
        $(obj).click(function() {
            Cyclone.mixPanel(obj,'click',{});
        });
        var tempTimer;
        $(obj).hover(
            function () {
                tempTimer=new Date();
            },
            function () {
                var hoverTime= new Date()-tempTimer;
                if(hoverTime>=250){
                    Cyclone.mixPanel(obj,'hover',{'hoverTime':hoverTime});
                }
            }
        );
        $(obj).css('border','1px solid yellow')
    });
}
Cyclone.mixPanel = function(obj, action, addon){
    addon = addon || {};
    var temp = $(obj).data();
    temp.action=action;
    temp.id=obj.getAttribute('data-cyclone-id');
    temp = $.extend(temp,addon);
    mixpanel.track('action:'+temp['action'],temp);
    mixpanel.track('region:'+temp['region'],temp);
    mixpanel.track('id:'+temp['cycloneId'],temp);
}