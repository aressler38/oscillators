define([
    "DragHandler",
    "Component",
    "Components",
    "Toolbar",
    "utils/getMatrix"
], function (DragHandler, Component, Components, Toolbar, getMatrix) {

    // TODO: perhaps abstracting this queue and step function to a singleton
    // class would make sense for use in other projects...
    const RENDER_QUEUE = [];
    const LAYOUT = {
        margin: 10,
        marginWide: 20,
        marginTall: 20
    };

    if ( !window.requestAnimationFrame ) {
        alert ("Error: you're missing window.requestAnimationFrame");
    } else { window.requestAnimationFrame(step); }

    /**
     * @private
     * @callback
     * callback for requestAnimationFrame.
     * Objects in the RENDER_QUEUE must have a `render` method.
     */
    function step ( time ) {
        for (var i=0; i<RENDER_QUEUE.length; i++) {
            if ( RENDER_QUEUE[i].sleep ) {
                // sleep
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
        initializeApp.call(this);
        postInitialize.call(this);
        return this;
    }

    /**
     * @private
     * Initializer function for App constructor. Context (this) is an instance of App.
     * Extends the App context.
     */
    function initializeApp () {
        this.tools = new Toolbar();
        this.sleep = true;
        this.el = document.getElementById("app");
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.components = new Components();
        /**
         * @public
         * Main rendering function for the App. This is executed in a `requestAnimationFrame`.
         */
        this.render = function () {
            //console.debug("render");
            var _cList = this.components.list;
            var i = 0, j=0;
            var len = _cList.length;
            var _tolen = _cList.length;
            var c1Matrix = null;
            var c2Matrix = null;
            var _style = null;
            this.canvas.width = this.canvas.width;
            this.components.computeStyles();
            for (; i<len; i++) {
                // we only need to handle the `to` connections
                c1Matrix = getMatrix(_cList[i]._style);
                _tolen = _cList[i].connections.to.length
                if ( _tolen ) {
                    for (j=0; j<_tolen; j++) {
                        _style = _cList[i].connections.to[j]._style;
                        c2Matrix = getMatrix(_style);
                        this.drawLine(c1Matrix[4]+50, c1Matrix[5]+25, c2Matrix[4], c2Matrix[5]+25);
                    }
                }
            }
        }.bind( this );
    }

    /**
     * @private
     * Does not extend the App context
     */
    function postInitialize () {
        var that = this;
        /**
         * @private
         * @callback
         * Callback for window's resize event.
         */
        var renderApp = function (event) {
            var appStyle = window.getComputedStyle(this.el);
            this.el.style.width=(window.innerWidth - LAYOUT.marginWide) + "px";
            this.el.style.height=(window.innerHeight - LAYOUT.marginTall) + "px";
            this.canvas.width = parseInt(appStyle.width);
            this.canvas.height = parseInt(appStyle.height);
        }.bind( this );
        // resize the app frame on resize
        window.addEventListener("resize", renderApp);
        RENDER_QUEUE.push(this);

        // ON RENDER START
        renderOneTime.call(this);

        this.el.appendChild(this.canvas);
        this.el.appendChild(this.tools.el);
        this.tools.el.addEventListener("click", renderOneTime.bind(this));

        this.tools.el.querySelector(".add-component.gain").addEventListener("click", function () {
            var gain = new Component({
                type: "gain",
                position: [50, 75]
            });
            that.add(gain);
        });
        this.tools.el.querySelector(".add-component.oscillator").addEventListener("click", function () {
            var oscillator = new Component({
                type: "oscillator",
                position: [10, 10]
            });
            that.add(oscillator);
        });

        renderApp(); // render immediately
    }

    /**
     * @private
     * @context varies, use the .call method to execute this on a renderable object (has render method).
     * Used for app when 'snapping' the line to a component or clearing the canvas.
     */
    function renderOneTime (callback) {
        var that = this;
        this.sleep = false;
        RENDER_QUEUE.push({
            render: function() {
                that.sleep=!that.sleep;
                RENDER_QUEUE.pop();
                if ( typeof callback === "function" ) { callback(); }
            }.bind(this)
        });
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

    App.prototype.select = function (hash) {
        this.components.select(hash);
        var component = this.components.selected;
        this.tools.setToolName(component.type);
        this.tools.clearControls();
        for (var ctrl in component.controls) {
            this.tools.addControl(component.controls[ctrl]);
        }
    };

    /**
     * @private
     * Handle the component's handles (in/out) DOM elements, and the
     * component itself.
     * @param {Element} el reference to the DOM element of the component object.
     */
    function bindComponentEvents (el) {
        var that = this;
        var _in = el.querySelector(".in");
        var _out = el.querySelector(".out");
        var dragFromOutput = null; // shall represent user's selection of either .in or .out elements.
        var index = null;
        _in.addEventListener("mousedown", selectParent);
        _in.addEventListener("touchstart", selectParent);
        _out.addEventListener("mousedown", selectParent);
        _out.addEventListener("touchstart", selectParent);
        new DragHandler(_in, drag, start, stop);
        new DragHandler(_out, drag, start, stop);
        el.addEventListener("click", function() {
            that.select(this.dataset.hash);
        });
        el.addEventListener("mousedown", wakeup);
        el.addEventListener("mouseup", sleep);
        el.addEventListener("touchstart", wakeup);
        el.addEventListener("touchend", sleep);

        function selectParent (event) {
            that.select(this.parentElement.dataset.hash);
        }
        function wakeup () {
            clearCanvasBackground.call(that);
            that.sleep = false;
        }
        function sleep () {
            that.sleep = true;
        }
        function drag (xrel, yrel, z, x, y) {
            RENDER_QUEUE[index].x1 = x;
            RENDER_QUEUE[index].y1 = y;
        }
        /**
         * DragHandler callback
         * @callback
         * @context Element
         */
        function start (x, y, z) {
            dragFromOutput = this.classList.contains("out");
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
        /**
         * DragHandler callback
         * @callback
         * @context Element
         */
        function stop (x, y, z) {
            RENDER_QUEUE.pop();
            that.saveLine(x, y);
            if ( detectNeighbor(that.components.selected, x, y, dragFromOutput) ) {
            }
            renderOneTime.call(that, function() {
            //    saveCanvasAsBackground.call(that);
            });
        }

        /**
         * linear search:
         * Iterate over the list of components and find the component that
         * is within a certain e-disk from where the user mouseup'd or released
         * their finger/stylus.
         * @param {Component} component currently selected
         * @param {number} x1 clientX of line drawn
         * @param {number} y1 clientY of line drawn
         * @param {boolean} out will only be `true` if the user started dragging from the output of `component`
         * @return {boolean} outcome of detection: `true` if dragged line is within the e-disk.
         */
        function detectNeighbor (component, x1, y1, out) {
            const radius = 75; // threshold of drop detection
            const len = that.components.list.length;
            var delta = null;
            var pos = null;
            var _c = null;
            for (var i=0; i<len; i++) {
                pos = that.components.list[i].getPos();
                delta = dist(x1, y1, pos[0], pos[1]);
                // I'd normally cache the list, but the lookup will only happen if delta < radius
                if ( delta < radius && 
                     component !== that.components.list[i] &&
                     that.components.list[i].type !== "oscillator"
                ) {
                    //console.debug("WITHIN RADIUS OF", that.components.list[i]);
                    // detect in/out order
                    if ( out ) {
                        component.connect(that.components.list[i]);
                    } else {
                        that.components.list[i].connect(component);
                    }
                    return true;
                }
            }
            return false;
        }

        // write dist function for x1,y1 to x2,y2...
        function dist (x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
        }
    }


    function drawSoftLine(ctx, x1, y1, x2, y2, lineWidth, r, g, b, a) {
       var widths = [1   , 0.8 , 0.6 , 0.4 , 0.2  ];
       var alphas = [0.2 , 0.4 , 0.6 , 0.8 , 1    ];
       var previousAlpha = 0;
       for (var pass = 0; pass < widths.length; pass++) {
          ctx.beginPath();
          ctx.lineWidth = lineWidth * widths[pass];
           ctx.lineCap = "round";
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

    /**
     * @method
     * append components to the app
     */
    App.prototype.add = function () {
        for (var index in arguments) {
            _addComponent.call(this, arguments[index]);
        }
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
     * @example
     * note: 'x->y' means x is connected to y
     * connect("gain", "destination");  ==>   'gain'->'destination'
     * connect("oscillator", "gain", "destination"  ==> 'oscillator'->'gain'->'destination'
     */
    App.prototype.connect = function () {
        for (var i=0; i<arguments.length-1; i++) {
            this.components[arguments[i]].connect(this.components[arguments[i+1]]);
        }
    };


    return App;
});
