define(function() {

    const LAYOUT = {
        margin: 20
    };

    var register = null;

    /**
     * @constructor
     */
    function App () {
        this.el = document.getElementById("app"); 
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.el.appendChild(this.canvas);

        var renderApp = function (event) {
            var appStyle = window.getComputedStyle(this.el);
            this.el.style.width=(window.innerWidth-20) + "px";
            this.el.style.height=(window.innerHeight-20) + "px";
            this.canvas.width = parseInt(appStyle.width);
            this.canvas.height = parseInt(appStyle.height);
        }.bind( this );

        // resize the app frame on resize
        window.addEventListener("resize", renderApp);
        return renderApp();
    }

    // =========
    // PROTOTYPE
    // =========
    
    // TODO: should we store components in a list?
    // YES!!! we can use that to connect and disconnect items...
    // we need to be commutative when we connect and disconnect via dragging because a user
    // can drag ltr or rtl... we need to basically detect which way is the wrong way and reverse it
    // automatically for them... 

    /**
     * @method
     * append components to the app
     */
    App.prototype.add = function () {
        for (var index in arguments)
            this.el.appendChild(arguments[index].el);
    };
    App.prototype.remove = function (component) {
        this.el.removeChild(component.el);
    };

    App.prototype.startLine = function (x, y) {
        
    };

    App.prototype.drawLine = function (x, y) {

    };

    App.prototype.killLine = function () {

    };

    App.prototype.stopLine = function (x, y) {

    };


    return App;
});
