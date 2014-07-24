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
    "Toolbar"
],function(Component, Toolbar) {

    var app = document.getElementById("app");
    var body = document.querySelector("body");

    var tools = new Toolbar();
    var component = new Component();

    app.appendChild(component.el);

    app.appendChild(tools.el);

    window.tools = tools;
    return void 0;
});
