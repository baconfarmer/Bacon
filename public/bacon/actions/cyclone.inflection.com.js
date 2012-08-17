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
    }
}
