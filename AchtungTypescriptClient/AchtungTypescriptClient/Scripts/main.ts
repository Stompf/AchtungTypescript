// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        'jquery': 'jquery-2.1.4.min',
        'knockout': 'knockout-3.4.0',
        'underscore': 'underscore.min'
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
    const canvas = <HTMLCanvasElement>document.getElementById('canvasGame');
    if (canvas == null) {
        alert('could not find canvas!');
        return;
    }

    var achtungTypescript = new app(canvas);
    achtungTypescript.start();
    console.log('done');
});