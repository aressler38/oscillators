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
    "App"
],function(Component, App) {

    var body = document.querySelector("body");
    var app  = new App();

    var oscillator = new Component({
        type: "oscillator",
        position: [100, 100]
    });
    var gain = new Component({
        type: "gain",
        position: [175, 200]
    });
    var destination = new Component({
        type: "destination",
        position: [300, 300]
    });

    app.add(oscillator, gain, destination);

    app.connect("oscillator_0", "gain_1"); //, "destination_2");

    console.debug(window.app=app);
    //console.warn("Warning: stopping in 2...", app.components.oscillator_0.node.stop(2) || "1...")

    app.tools.toggle();
    app.select(app.components.list[0].el.dataset.hash);
    return void 0; //OK!
});
