define(["DragHandler", "Component"], function (DragHandler, Component) {

    const LAYOUT = {
        margin: 10 
    };

    var register = null;

    if ( !window.requestAnimationFrame ) {
        alert ("Error: you're missing window.requestAnimationFrame");
    }

    /**
     * @constructor
     */
    function App () {
        this.el = document.getElementById("app"); 
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.el.appendChild(this.canvas);
        this.components = { length: 0 };

        var renderApp = function (event) {
            var appStyle = window.getComputedStyle(this.el);
            this.el.style.width=(window.innerWidth-20) + "px";
            this.el.style.height=(window.innerHeight-20) + "px";
            this.canvas.width = parseInt(appStyle.width);
            this.canvas.height = parseInt(appStyle.height);
        }.bind( this );

        // resize the app frame on resize
        window.addEventListener("resize", renderApp);

        renderApp(); // render immediately
    }

    /**
     * @private
     */
    function _addComponent (component) {
        this.components.length++;
        var hash = this.components.length;
        this.components[hash] = component;
        component.el.dataset.hash = hash
        bindComponentEvents.call(this, component.el);
        this.el.appendChild(component.el);
    }

    /**
     * @private
     */
    function bindComponentEvents (el) {
        var that = this;
        var _in = el.querySelector(".in");
        var out = el.querySelector(".out");
        new DragHandler(_in, drag, start, stop);
        new DragHandler(out, drag, start, stop);
        function drag (xrel, yrel, z, x, y) {
            //console.debug("DRAG")
            that.ctx.lineTo(x-LAYOUT.margin, y-LAYOUT.margin);
            that.ctx.stroke();
        }
        function start (x, y, z, event) {
            //console.debug("START")
            that.ctx.beginPath();
            that.ctx.moveTo(x-LAYOUT.margin, y-LAYOUT.margin);
        }
        function stop (x, y, z, event) {
            //console.debug("STOP")
            that.ctx.stroke();
        }
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
            _addComponent.call(this, arguments[index]);
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
