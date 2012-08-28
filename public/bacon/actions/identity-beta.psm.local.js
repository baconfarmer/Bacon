(function () {
var bacon = bacon || {};

bacon.config = { "/identity/register':
    {
        parser:[
            {name:'data_dash',options:{a:'a'}},
            {name:'page_load'}
        ]
        ,writer:[
        {name:'mixpanel',options:{}}
    ]
    },
        '/identity/profile' :
        {
            parser:[
                {name:'data_dash',options:{a:'a'}},
                {name:'page_load'}
            ]
            ,writer:[
            {name:'mixpanel',options:{mixpanelID:'3c5c277b364eaa532ae4ebc9e50d742d'}},
            {name:'GA',options:{gaID:'3c5c277b364eaa532ae4ebc9e50d742d'}}
        ]
    }
}
});
