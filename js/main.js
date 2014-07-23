require.config({
    "paths": {
        "text" : "lib/text",
        "Templates" : "templates/Templates",
        "underscore" : "lib/underscore-min"

    },
});
define([
    "Component"
],function(Component) {

    var app = document.getElementById("app");

    var component = new Component();

    app.appendChild(component.el);

    return void 0;
});
