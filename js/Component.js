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
        
        this.el = docfrag.querySelector("div");
        translate3d = translate3d.bind(this.el);

        // Config settings...
        if ( config.draggable ) {
            new DragHandler(this.el, translate3d);
        }
        translate3d(config.position[0]+"px", config.position[1]+"px", 0);
        if (!bool) { // type isn't null
            config.type=config.type[0].toUpperCase() + config.type.substring(1);
            this.el.classList.add(config.type.toLowerCase());
            this.node = audioContext["create"+config.type]();
        }
        else {
            this.node = null;
        }

        // don't allow dragging when touching the handles
        [this.el.querySelector(".in"), this.el.querySelector(".out")].forEach(function (el, i, self) {
            el.addEventListener("mousedown", preventAndStop);
            el.addEventListener("touchstart", preventAndStop);
        });

        /* local functions */

        function translate3d (x, y, z) {
            this.style.transform = "translate3d("+x+","+y+","+z+")";
        }

        function preventAndStop (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
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
