// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

requirejs.config({
    urlArgs: 'bust=' + (new Date()).getTime(),
    paths: {
        'jquery': 'jquery-3.1.1.min',
        'knockout': 'knockout-3.4.0',
        'underscore': 'underscore.min',
        'moment': 'moment-with-locales.min',
        'bootstrap': 'bootstrap.min'
    },
    shim: {
        "jquery": { exports: '$' },
        "underscore": { exports: '_' },
        "knockout": { exports: 'ko' },
        "bootstrap": { "deps": ['jquery'] }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
require(['app/appMain', 'jquery', 'underscore', 'bootstrap'], (appMain: any) => {
    var appMain = new appMain();
    appMain.activate();
});