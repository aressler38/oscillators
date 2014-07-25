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

    // resize the app frame on resize
    window.addEventListener("resize", renderApp);

    function renderApp (event) {
        app.style.width=(window.innerWidth-20) + "px";
        app.style.height=(window.innerHeight-20) + "px";
    }

    renderApp();

    return void 0; //OK!
});
