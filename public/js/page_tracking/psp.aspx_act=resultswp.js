if(typeof cyclone ==='undefined'){
    jQuery(document).ready(function() {
        cyclone.main = new Cyclone.main();
    });
}
cyclone.search = {};
cyclone.search.search_criteria={};
cyclone.search.search_criteria['count']=jQuery('#fullresult table').find('tr').length-1;//parseInt(jQuery('#number_results').text());
if(!(cyclone.search.search_criteria['count']>=1)){
    cyclone.search.search_criteria['count']=0;
}
if(jQuery('#single').length===1){
    cyclone.search.search_criteria['count']=1;
}
cyclone.search.search_criteria['funnel']='whitepage';
cyclone.search.search_criteria['session']=cyclone.main.guid;
cyclone.search.search_criteria['visit']=cyclone.main._id;//get cyclone visit id
cyclone.search._id=Cyclone.main.prototype.guid();
cyclone.search.search_criteria['_id']=cyclone.search._id;
jQuery('.searchexpanded').each(function(index){
    if(jQuery(this).find('input').val()!=='' && typeof jQuery(this).find('input').val() !== 'undefined'){
        var search_query= jQuery(this).find('input').attr('id');
        switch(search_query){
            case "FirstName":
                cyclone.search.search_criteria['firstname'] =jQuery(this).find('input').val();
                break;
            case "LastName":
                cyclone.search.search_criteria['lastname'] =jQuery(this).find('input').val();
                break;
            case "State":
                cyclone.search.search_criteria['state'] =jQuery(this).find('input').val();
                break;
            case "ZIPCode":
                cyclone.search.search_criteria['zip'] =jQuery(this).find('input').val();
                break;
            case "MaidenName":
                cyclone.search.search_criteria['maidenname'] =jQuery(this).find('input').val();
                break;
            case "MiddleName":
                cyclone.search.search_criteria['middlename'] =jQuery(this).find('input').val();
                break;
            case "City":
                cyclone.search.search_criteria['city'] =jQuery(this).find('input').val();
                break;
        }
    }
    else if(jQuery(this).find('select').length===1 && jQuery(this).find('select').val()!==""){
        cyclone.search.search_criteria['state'] = jQuery(this).find('select').val();
    }
});
if(jQuery('#single').length===1){
    $('.nextactionLink').each(function(index){
        var temp = index
        if($(this).parent().find('label').text().length<=30){
            temp = $(this).parent().find('label').text().replace(" ","").replace(":","");
        }
        jQuery(this).addClass('result_link pos_' + temp);
    });
}
else{
    jQuery('#fullresult table').find('tr').each(function(index){
        jQuery(this).find('a').addClass('result_link pos_' + index);
    });
}
var temp =['exact','age','living']
jQuery('#filter input').each(function(index){
    jQuery(this).addClass('filter_' + temp[index]);
})
cyclone.search.socket_terminated = false;
//socket.io
jQuery.getScript('https://cyclone.inflection.com:3000/socket.io/socket.io.js', function(data, textStatus, jqxhr) {
    cyclone.search.socket = io.connect('https://cyclone.inflection.com:3000/', {secure: true});
    cyclone.search.socket.emit('search_track', cyclone.search.search_criteria);
    jQuery('#filter input').click(function(){
        var filter= [jQuery(this).attr('class').split('_')[1]+'_'+jQuery(this).val()];
        var output={};
        output['_id']=cyclone.search._id;
        output['pick']= filter;
        cyclone.search.socket.emit('search_track_end',output);
    });

    jQuery('.result_link').click(function(){
        var output={};
        output['_id']=cyclone.search._id;
        output['duration']=(new Date() - cyclone.main.t0);
        output['target']= jQuery(this).attr('class').split('pos_')[1];
        cyclone.search.socket.emit('search_track_end',output);
        cyclone.search.socket_terminated=true;
    });
    jQuery(window).bind('beforeunload', function () {
        if(!cyclone.search.socket_terminated){
            var output={};
            output['_id']=cyclone.search._id;
            output['duration']=(new Date() - cyclone.main.t0);
            cyclone.search.socket.emit('search_track_end',output);
        }
    });
    cyclone.search.socket.on('disconnect', function (data) {
        if(!cyclone.search.socket_terminated){
            var output={};
            output['_id']=cyclone.search._id;
            output['duration']=(new Date() - cyclone.main.t0);
            cyclone.search.socket.emit('search_track_end',output);
        }
    });
//    socket.on('news', function (data) {
//        console.log(data);
//        socket.emit('my other event', { my: 'data' });
//    });
});

