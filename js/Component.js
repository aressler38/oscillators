define([
    "Templates",
    "configurer",
    "audioContext",
    "DragHandler",
    "Control"
], function (Templates, configurer, audioContext, DragHandler, Control) {

    const COMPONENT_DEFAULTS = {
        el: null,
        type: null,
        draggable: true
    };

    /**
     * @constructor
     * Base class for components, sets up the base template and  
     */
    function Component (config) {
        const that = this;
        config = configurer(COMPONENT_DEFAULTS, config);
        
        this.node = (config.type !== null) ? audioContext["create"+config.type]() : null;
        const docfrag = Templates("component");
        this.el = docfrag.querySelector("div");

        var originalEvent = null;

        // TODO: deal with the config object...
        if ( config.draggable ) {
            new DragHandler(this.el, translate3d);
        }

        /* local functions */

        function translate3d (x, y, z) {
            this.style.transform = "translate3d("+x+","+y+","+z+")";
        }
        translate3d = translate3d.bind(this.el);

        
        return this;
    }

    // =========
    // PROTOTYPE
    // =========

    Component.prototype.connect = function (node) {
        this.node.connect(node);
    };
    Component.prototype.disconnect = function () {
        this.node.disconnect();
    };
    Component.prototype.start = function () {
        this.node.start();
    };
    Component.prototype.stop = function () {
        this.node.stop();
    };

    Component.prototype.adjust = function (control, value) {
        this.controls[control].set(value);
    } 

    return Component;
});
