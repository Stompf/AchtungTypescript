// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.

import AchtungTypescript = require('./game/app');

requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        'jquery': 'jquery-2.2.0.min',
        'knockout': 'knockout-3.4.0',
        'underscore': 'underscore.min',
        'moment': 'moment.min'
    },
    shim: {
        "jquery": { exports: "$" },
        "underscore": { exports: "_" },
        "knockout": { exports: "ko" }
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['game/app'], (app: any) => {

    setTimeout(() => {
        const canvas = <HTMLCanvasElement>document.getElementById('canvasGame');
        if (canvas == null) {
            alert('could not find canvas!');
            return;
        }

        var achtungTypescript = new app(canvas) as AchtungTypescript;
        //achtungTypescript.startNetwork();
        achtungTypescript.startLocal();
        console.log('done');
    }, 1000);
});