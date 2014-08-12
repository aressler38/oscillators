define([
    "Templates",
    "configurer",
    "audioContext",
    "DragHandler",
    "Control",
    "utils/getMatrix"
], function (Templates, configurer, audioContext, DragHandler, Control, getMatrix) {

    const COMPONENT_DEFAULTS = {
        el: null,
        type: null,
        draggable: true,
        position: [0, 0]
    };

    /**
     * @constructor
     * Base class for components, sets up the base template and  
     */
    function Component (config) {
        const that = this;
        const docfrag = Templates("component");
        config = configurer(COMPONENT_DEFAULTS, config);
        var bool = (config.type === null);

        // Keep track of which components are to this component
        // and which components to which this is attached.
        this.connections = { 
            to: [ ],
            from: [ ]
        };
        
        this.type = config.type;
        this.el = docfrag.querySelector("div");
        translate3d = translate3d.bind(this.el);

        // Config settings...
        if ( config.draggable ) {
            new DragHandler(this.el, translate3d);
        }
        translate3d.apply(this, config.position.concat([0]));
        bool = config.type === "destination" ? true : false;
        if ( !bool ) { // type isn't null
            config.type = config.type[0].toUpperCase() + config.type.substring(1);
            this.node = audioContext["create"+config.type]();
            this.node.start && this.node.start(0);
            createControls.call(this);
        }
        else {
            this.node = audioContext.destination;
        }
        this.el.classList.add(config.type.toLowerCase());

        // don't allow dragging when touching the handles
        [this.el.querySelector(".in"), this.el.querySelector(".out")].forEach(function (el, i, self) {
            el.addEventListener("mousedown", stopEvent);
            el.addEventListener("touchstart", stopEvent);
        });

        /* local functions */

        function translate3d (x, y, z) {
            this.style.transform = "translate3d("+x+"px,"+y+"px,"+z+"px)";
        }

        function stopEvent (event) {
            event.stopPropagation();
        }
        
        return this;
    }

    /** @private */
    function clearConnections () {
        while (this.connections.to.length) {
            this.connections.to[i].pop();
        }
        while (this.connections.from.length) {
            this.connections.from[i].pop();
        }
    }

    /** @private */
    function createControls () {
        var controls = {};
        if (this.type==="oscillator") {
            controls.frequency = new Control({
                min : 0,
                max : 880,
                value: this.node.frequency.value,
                step: 10
            });
            controls.frequency.oninput = function (value) {
                this.node.frequency.value = value;
            }.bind(this);

        }
        else if (this.type==="gain") {
            controls.volume = new Control({
                type: "slider",
                min: 0,
                max: 10,
                step: 1,
                value: this.node.gain.value,
                filter: function (value) {
                    return value * 0.1;
                }
            });
            controls.volume.oninput = function (value) {
                this.node.gain.value = value;
            }.bind(this);
        }

        this.controls = controls;
    }

    // =========
    // PROTOTYPE
    // =========

    /** @param {Component} component */
    Component.prototype.connect = function (component) {
        this.node.connect(component.node);
        this.connections.to.push(component);
    };
    Component.prototype.disconnect = function () {
        clearConnections.call(this);
        this.node.disconnect();
    };
    Component.prototype.start = function () {
        this.node.start();
    };
    Component.prototype.stop = function () {
        this.node.stop();
    };
    Component.prototype.computeStyle = function () {
        this._style = window.getComputedStyle(this.el);
        return this._style;
    };
    Component.prototype.getPos = function () {
        const offset = 25; // with offset... shouldn't be hard coded like this        
        const matrix = getMatrix(window.getComputedStyle(this.el));
        return [ matrix[4]+offset, matrix[5]+offset ];
    };
    /** @deprecated */
    Component.prototype.adjust = function (control, value) {
        this.controls[control].set(value);
    };


    return Component;
});
