var bacon = bacon || {};

bacon.config={
    parser:[
       {name:'data_dash',options:{a:'a'}},
       {name:'page_load'}
    ]
    ,writer:[
        {name:'mixpanel',options:{}}
//        {name:'local',options:{}}
    ]
}