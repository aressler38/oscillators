define(["DragHandler", "Component"], function (DragHandler, Component) {

    const RENDER_QUEUE = [];
    const LAYOUT = {
        margin: 10 
    };

    var register = null;

    if ( !window.requestAnimationFrame ) {
        alert ("Error: you're missing window.requestAnimationFrame");
    } else {
        window.requestAnimationFrame(step);
    }

    function step ( time ) {
        for (var i=0; i<RENDER_QUEUE.length; i++) {
            RENDER_QUEUE[i]();
        }
        window.requestAnimationFrame(step);
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

        this.render = function () {
        //    this.canvas.width = this.canvas.width;
        }.bind( this );

        RENDER_QUEUE.push(this.render);

        // resize the app frame on resize
        window.addEventListener("resize", renderApp);

        renderApp(); // render immediately
    }


    /**
     * @private
     * Add Component instances to the app and bind associated listeners.
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
     * Handle the component's handles (in/out) DOM elements, and the 
     * component itself.
     */
    function bindComponentEvents (el) {
        var that = this;
        var _in = el.querySelector(".in");
        var out = el.querySelector(".out");
        new DragHandler(_in, drag, start, stop);
        new DragHandler(out, drag, start, stop);
        function drag (xrel, yrel, z, x, y) {
            that.streachLine(x,y);
        }
        function start (x, y, z) {
            that.startLine(x,y);
        }
        function stop (xrel, yrel, z) {
            that.ctx.stroke();
            that.saveLine(xrel, yrel);
        }
    }   


    function drawSoftLine(ctx, x1, y1, x2, y2, lineWidth, r, g, b, a) {
       var widths = [1   , 0.8 , 0.6 , 0.4 , 0.2  ];
       var alphas = [0.2 , 0.4 , 0.6 , 0.8 , 1    ];
       var previousAlpha = 0;
       for (var pass = 0; pass < widths.length; pass++) {
          ctx.beginPath();
          ctx.lineWidth = lineWidth * widths[pass];
          // ctx.lineCap = "round";
          alpha = alphas[pass] * a;
          // Formula: (1 - alpha) = (1 - deltaAlpha) * (1 - previousAlpha)
          var deltaAlpha = 1 - (1 - alpha) / (1 - previousAlpha)
          ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + deltaAlpha + ")";
          ctx.lineCap = "round";
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          previousAlpha = alpha; 
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
    /**
     * @method
     * remove components from the app ui
     */
    App.prototype.remove = function (component) {
        this.el.removeChild(component.el);
    };

    App.prototype.startLine = function (x, y) {
        this.ctx.beginPath();
        this._draworigin = [x-LAYOUT.margin, y-LAYOUT.margin];
        this.ctx.moveTo(this._draworigin[0], this._draworigin[1]);
    };

    App.prototype.drawLine = function (x, y) {
        this.ctx.lineTo(x-LAYOUT.margin, y-LAYOUT.margin);
        this.ctx.stroke();
    };

    App.prototype.streachLine = function(x, y) {
        this.canvas.width = this.canvas.width;
        /*
        this.ctx.moveTo(this._draworigin[0], this._draworigin[1]);
        this.ctx.lineWidth = 10;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(x-LAYOUT.margin, y-LAYOUT.margin);
        
        this.ctx.stroke();
        */
        drawSoftLine(this.ctx, 
                this._draworigin[0], this._draworigin[1], 
                x-LAYOUT.margin, y-LAYOUT.margin, 10,    
                70, 80, 95, 0.8);
    }

    /**
     */
    App.prototype.saveLine = function (x, y) {
        // TODO; save line
        this.cleardraworigin();
    };

    App.prototype.cleardraworigin = function() {
        this._draworigin[0] = null;
        this._draworigin[1] = null;
    }

    App.prototype.connect = function (componentX, componentY) {
        this.state = "blah..."
            // TODO: save the state of the connected X,Y components
            // TODO: decide on proper data model;
        componentX.node.connect(componentY.node);
    };


    return App;
});
