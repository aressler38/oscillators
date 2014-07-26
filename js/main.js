// configure first
require.config({
    "paths": {
        "text" : "lib/text",
        "Templates" : "templates/Templates"
    }
});
// now define the `main` module
define([
    "Component",
    "Toolbar",
    "App"
],function(Component, Toolbar, App) {

    var body       = document.querySelector("body");
    var app        = new App();
    var tools      = new Toolbar();
    var oscillator = new Component({
        type: "oscillator",
        position: [100, 100]
    });
    var destination = new Component({
        type: "destination",
        position: [300, 300]
    });

    var gain = new Component({
        type: "gain",
        position: [175, 200]
    });

    app.add(oscillator, tools, gain, destination);

    return void 0; //OK!
});
