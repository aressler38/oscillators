define([
    "DragHandler", 
    "Component", 
    "Components",
    "utils/getMatrix"
], function (DragHandler, Component, Components, getMatrix) {

    const RENDER_QUEUE = [];
    const LAYOUT = {
        margin: 10, 
        marginWide: 20, 
        marginTall: 20
    };

    if ( !window.requestAnimationFrame ) {
        alert ("Error: you're missing window.requestAnimationFrame");
    } else { window.requestAnimationFrame(step); }

    function step ( time ) {
        for (var i=0; i<RENDER_QUEUE.length; i++) {
            if ( RENDER_QUEUE[i].sleep ) {

            } else {
                RENDER_QUEUE[i].render();
            }
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
        this.components = new Components();

        this.sleep = true;

        var renderApp = function (event) {
            var appStyle = window.getComputedStyle(this.el);
            this.el.style.width=(window.innerWidth - LAYOUT.marginWide) + "px";
            this.el.style.height=(window.innerHeight - LAYOUT.marginTall) + "px";
            this.canvas.width = parseInt(appStyle.width);
            this.canvas.height = parseInt(appStyle.height);
        }.bind( this );

        this.render = function () {
            var _components = this.components.list;
            var i = 0, j=0;
            var len = _components.length;
            var _tolen = _components.length;
            var c1Matrix = null;
            var c2Matrix = null;
            var _style = null;
            this.canvas.width = this.canvas.width;
            this.components.computeStyles();
            for (; i<len; i++) {
                // we only need to handle the `to` connections
                c1Matrix = getMatrix(_components[i]._style);
                _tolen = _components[i].connections.to.length 
                if ( _tolen ) {
                    for (j=0; j<_tolen; j++) {
                        _style = this.components[_components[i].connections.to[j]]._style;
                        c2Matrix = getMatrix(_style);
                        this.drawLine(c1Matrix[4]+50, c1Matrix[5]+25, c2Matrix[4], c2Matrix[5]+25);
                    }
                }
            }
        }.bind( this );

        RENDER_QUEUE.push(this);

        // ON RENDER START
        RENDER_QUEUE.push({
            render: function() { this.sleep=false; RENDER_QUEUE.pop(); }.bind(this)
        });

        // resize the app frame on resize
        window.addEventListener("resize", renderApp);

        renderApp(); // render immediately
    }

    /**
     * @private
     * Add Component instances to the app and bind associated listeners.
     */
    function _addComponent (component) {
        this.components.add(component);
        bindComponentEvents.call(this, component.el);
        this.el.appendChild(component.el);
    }

    /**
     * @private
     * Handle the component's handles (in/out) DOM elements, and the 
     * component itself.
     * @param {Element} el reference to the DOM element of the component object.
     */
    function bindComponentEvents (el) {
        var that = this;
        var _in = el.querySelector(".in");
        var out = el.querySelector(".out");
        var index = null;
        new DragHandler(_in, drag, start, stop);
        new DragHandler(out, drag, start, stop);
        el.addEventListener("mousedown", wakeup);
        el.addEventListener("mouseup", sleep);
        el.addEventListener("touchstart", wakeup);
        el.addEventListener("touchend", sleep);

        function wakeup () {
            clearCanvasBackground.call(that);
            that.sleep = false; 
        }
        function sleep () { that.sleep = true; }
        function drag (xrel, yrel, z, x, y) {
            RENDER_QUEUE[index].x1 = x;
            RENDER_QUEUE[index].y1 = y;
        }
        function start (x, y, z) {
            clearCanvasBackground.call(that);
            that.sleep = false;
            that.startLine(x,y);
            index = RENDER_QUEUE.push({
                type : "stretchLine",
                x0 : x,
                y0 : y,
                x1 : x,
                y1 : y,
                render: function () {
                    drawSoftLine(that.ctx, 
                        this.x0-LAYOUT.margin, this.y0-LAYOUT.margin,
                        this.x1-LAYOUT.margin, this.y1-LAYOUT.margin,
                        10,               // lineWidth
                        70, 80, 95, 0.8); // rgba
                }
            }) - 1;
        }
        function stop (xrel, yrel, z) {
            RENDER_QUEUE.pop();
            that.saveLine(xrel, yrel);
            saveCanvasAsBackground.call(that);
            that.sleep = true;
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

    function clearCanvasBackground () {
        this.canvas.style.background = "ghostwhite";
    }
    function saveCanvasAsBackground () {
        this.canvas.style.background = "url("+this.canvas.toDataURL()+") ghostwhite";
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

    App.prototype.drawLine = function (x0, y0, x1, y1) {
        drawSoftLine(this.ctx, 
                x0, y0, 
                x1, y1,
                10,               // lineWidth
                70, 80, 95, 0.8); // rgba
    };

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

    /**
     * Connect a list of components as in a chain
     * @param {String} name of component in the components object
     */
    App.prototype.connect = function () {
        for (var i=0; i<arguments.length-1; i++) {
            this.components[arguments[i]].connections.to.push(arguments[i+1]);
            this.components[arguments[i]].connect(this.components[arguments[i+1]].node);
        }
    };


    return App;
});
