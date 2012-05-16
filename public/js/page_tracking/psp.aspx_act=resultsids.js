var search_criteria={};
search_criteria['count']=parseInt(jQuery('#number_results').text());
search_criteria['id']=guid;
jQuery('.searchexpanded').each(function(index){
    if(jQuery(this).find('input').val()!=='' && typeof jQuery(this).find('input').val() !== 'undefined'){
        var search_query= jQuery(this).find('input').attr('id');
        switch(search_query){
            case "FirstName":
                search_criteria['firstname'] =jQuery(this).find('input').val();
                break;
            case "LastName":
                search_criteria['lastname'] =jQuery(this).find('input').val();
                break;
            case "State":
                search_criteria['state'] =jQuery(this).find('input').val();
                break;
            case "ZIPCode":
                search_criteria['zip'] =jQuery(this).find('input').val();
                break;
            case "MaidenName":
                search_criteria['maidenname'] =jQuery(this).find('input').val();
                break;
            case "MiddleName":
                search_criteria['middlename'] =jQuery(this).find('input').val();
                break;
            case "City":
                search_criteria['city'] =jQuery(this).find('input').val();
                break;
        }
    }
    if(jQuery(this).find('select').val()!==''){
        search_criteria['state'] =jQuery(this).find('select').val();
    }
});

jQuery('#resultsname table').find('tr').each(function(index){
    jQuery(this).find('a').addClass('result_link pos_' + index);
})
var temp =['exact','age','living']
jQuery('#filter input').each(function(index){
    jQuery(this).addClass('filter_' + temp[index]);
})
var socket_terminated = false;
//socket.io
jQuery.getScript('http://cyclone.inflection.com:3000/socket.io/socket.io.js', function(data, textStatus, jqxhr) {
    var socket = io.connect('http://cyclone.inflection.com:3000/');
    socket.emit('search_track', search_criteria);
    jQuery('#filter input').click(function(){
        var filter= [jQuery(this).attr('class').split('_')[1]+'_'+jQuery(this).val()];
        var output={};
        output['id']=guid;
        output['pick']= filter;
        socket.emit('search_track_end',output);
    });

    jQuery('.result_link').click(function(){
        var output={};
        output['id']=guid;
        output['duration']=(new Date() - cyclone_dt);
        output['target']= jQuery(this).attr('class').split('pos_')[1];
        socket.emit('search_track_end',output);
        socket_terminated=true;
    });
    jQuery(window).bind('beforeunload', function () {
        if(!socket_terminated){
            var output={};
            output['id']=guid;
            output['duration']=(new Date() - cyclone_dt);
            socket.emit('search_track_end',output);
        }
    });
    socket.on('disconnect', function (data) {
        if(!socket_terminated){
            var output={};
            output['id']=guid;
            output['duration']=(new Date() - cyclone_dt);
            socket.emit('search_track_end',output);
        }
    });
//    socket.on('news', function (data) {
//        console.log(data);
//        socket.emit('my other event', { my: 'data' });
//    });
});

