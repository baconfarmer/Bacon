var bacon = bacon || {};

bacon.config = { "/identity/register.html" :
    {
        parser:[
            {name:'data_dash',options:{a:'a'}},
            {name:'page_load'}
        ]
        ,writer:[
        {name:'mixpanel',options:{}}
    ]
    },
        '/identity/profile.html' :
        {
            parser:[
                {name:'data_dash',options:{a:'a'}},
                {name:'page_load'}
            ]
            ,writer:[
            {name:'mixpanel',options:{}}
        ]
    },
        'resultsemail-rev' :
        {
            parser:[
                {name:'data_dash',options:{a:'a'}},
                {name:'page_load'}
            ]
            ,writer:[
            {name:'mixpanel',options:{mixpanelID:'3c5c277b364eaa532ae4ebc9e50d742d'}}
        ]
    }
}
